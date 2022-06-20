import { DefaultIterableDiffer } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  ValidatorFn
} from '@angular/forms';
import { of } from 'rxjs';
import { mergeAll, pairwise } from 'rxjs/operators';
import { AbstractField, ArrayField, ControlField, GroupField } from './base.field';
import { ExtendedControls, ExtendedFormArray, ExtendedFormControl, ExtendedFormGroup } from './form-controls';
import { AbstractFieldInterface, RelatedFieldInterface } from './interfaces/field-config.interface';


function isNullConfig(config: AbstractField): boolean {
  return config === null || config === undefined || !config;
}

export function createDynamicForm(
  configList: AbstractField[],
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): ExtendedFormGroup {
  const form = new ExtendedFormGroup({}, validatorOrOpts, asyncValidator);
  form.pathFromRoot = '';

  configList.forEach((config, index) => {
    if (isNullConfig(config)) {
      return;
    }

    config.internalOrder = config.hasOwnProperty('order') ? config.order : index;
    const control = debouncer(config, form.pathFromRoot, form);
    addControl(form, control, config, form);
    postProcess(control, config, form);
  });

  form.updateChildrenControls();

  return form;
}

function createFormControl(config: AbstractField, parentPath: string): ExtendedFormControl {
  const control = Reflect.construct(config.formControl, [
    config.initialValue,
    config.validatorOrOpts,
    config.asyncValidator,
  ]);

  control.pathFromRoot = joinPath(parentPath, config.key);

  return control;
}


function createFormGroupControl(config: GroupField, parentPath: string, rootForm: ExtendedFormGroup): ExtendedFormGroup {
  const parent = new ExtendedFormGroup({}, config.validatorOrOpts, config.asyncValidator);
  parent.pathFromRoot = joinPath(parentPath, config.key);

  config.configs.forEach((configChild, index) => {
    if (isNullConfig(configChild)) {
      return;
    }

    configChild.internalOrder = configChild.hasOwnProperty('order') ? configChild.order : index;
    const control = debouncer(configChild, parent.pathFromRoot, rootForm);
    addControl(parent, control, configChild, rootForm);
    postProcess(control, configChild, rootForm);
  });

  parent.updateChildrenControls();

  return parent;
}

function createFormArrayControl(config: ArrayField, parentPath: string, rootForm: ExtendedFormGroup): ExtendedFormArray {
  const parent = new ExtendedFormArray((value?: any) => {
    let fabricConfig;

    if (typeof config.configs === 'function') {
      fabricConfig = config.configs(value)
    } else {
      fabricConfig = config.configs
    }

    if (isNullConfig(fabricConfig)) {
      return null;
    }

    const control = debouncer(fabricConfig, parent.pathFromRoot, rootForm);
    control.fieldConfig = fabricConfig as any;

    postProcess(control, config, rootForm);

    return control
  }, config.validatorOrOpts, config.asyncValidator) as any;

  parent.pathFromRoot = joinPath(parentPath, config.key);

  return parent;
}


function debouncer(config: AbstractField, parentPath: string, rootForm: ExtendedFormGroup): ExtendedControls {
  if (config instanceof GroupField) {
    return createFormGroupControl(config as GroupField, parentPath, rootForm);
  } else if (config instanceof ArrayField) {
    return createFormArrayControl(config, parentPath, rootForm);
  }

  return createFormControl(config, parentPath);
}


function postProcess(control: AbstractControl & any, config: AbstractField, rootForm: ExtendedFormGroup): void {
  const relatedFields = config.relatedFields;

  if (!relatedFields) {
    return;
  }

  const initValueStr = config.initialValue instanceof Object ? config.initialValue.value : config.initialValue;

  const differ = new DefaultIterableDiffer<RelatedFieldInterface>(trackByItem);

  of(of(initValueStr), control.valueChanges).pipe(
    mergeAll(),
    pairwise(),
  ).subscribe((controlValues: any[]) => {
    const nextFieldsState = relatedFields.filter(v => controlIsVisible(v, controlValues, control));
    const diff = differ.diff(nextFieldsState);

    if (!diff) {
      return;
    }

    diff.forEachRemovedItem(v => {
      let relatedFieldConfig = v.item.configs;

      if (typeof relatedFieldConfig === 'function') {
        relatedFieldConfig = relatedFieldConfig(controlValues[1], controlValues[0], control);
      }

      removeControls(relatedFieldConfig, control.parent);
    });


    diff.forEachAddedItem(v => {
      let relatedFieldConfig = v.item.configs;

      if (typeof relatedFieldConfig === 'function') {
        relatedFieldConfig = relatedFieldConfig(controlValues[0], controlValues[1], control);
      }

      relatedFieldConfig.forEach((childConfig: AbstractField, index) => {
        if (isNullConfig(childConfig)) {
          return;
        }

        childConfig.internalOrder = childConfig.hasOwnProperty('order') ? childConfig.order : index;
        const childControl = debouncer(childConfig, control.parent.pathFromRoot, rootForm);

        if (control.parent.lastPatchedValue && control.parent.lastPatchedValue[childConfig.key]) {
          childControl.patchValue(
            control.parent.lastPatchedValue[childConfig.key],
            { emitEvent: false, useAsDefault: control.parent.defaultValuePatched }
          );
        }

        addControl(control.parent, childControl, childConfig, rootForm);
        postProcess(childControl, childConfig, rootForm);
      });
    });

    control.parent.updateChildrenControls();
  });
}


function trackByItem(index: number, item: any): string {
  return item;
}


function addControl(
  parent: ExtendedFormGroup | ExtendedFormArray,
  control: ExtendedControls,
  config: AbstractField,
  rootForm: ExtendedFormGroup
) {
  control.fieldConfig = config as any;
  parent.addControl(config.key, control, { emitEvent: false });

  if (rootForm.supposeControls.has(control.pathFromRoot)) {
    // @ts-ignore
    rootForm.supposeControls.get(control.pathFromRoot).next(control);
  }
}


function removeControls(configs: Array<AbstractFieldInterface>, parent: ExtendedFormGroup): void {
  configs.forEach(config => {
    if (parent.contains(config.key)) {
      parent.removeControl(config.key, { emitEvent: false });

      if (config.relatedFields) {
        config.relatedFields.forEach((c: any) => removeControls(c.configs, parent));
      }
    }
  });
}


function controlIsVisible(config: RelatedFieldInterface, controlValues: any[], control: ExtendedControls): boolean {
  const prevControlValue = controlValues[0];
  const controlValue = controlValues[1];

  switch (typeof config.checkVisibility) {
    case 'function': {
      // @ts-ignore
      return config.checkVisibility(controlValue, prevControlValue, control);
    }
  }

  return false
}


function joinPath(a: string, b: string): string {
  if (a !== '') {
    return `${a}.${b}`;
  }

  return b;
}
