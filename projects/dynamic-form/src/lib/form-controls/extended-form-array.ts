import { EventEmitter } from '@angular/core';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractField, ArrayField } from '../base.field';
import { CommonHelper, RandomHelper } from '../helpers';

import { ExtendedControls, ExtendedFormGroup, ExtendedFormControl } from './index';

export class ExtendedFormArray extends FormArray {
  public static type = 'FormArray';

  public readonly controlAdded: EventEmitter<ExtendedFormGroup> = new EventEmitter();
  public readonly formFactory?: (
    configs: AbstractField[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) => ExtendedFormGroup;

  private lastPatchedValue: any;

  public id = RandomHelper.NumId;
  public pathFromRoot!: string;
  public controls!: Array<ExtendedControls>;
  public childrenControls!: Array<ExtendedControls>;
  public fieldConfig!: ArrayField;
  public canAddRow: (() => boolean) | boolean = true;
  public defaultValuePatched = false;
  public htmlInstance!: HTMLElement;

  public error: Observable<string | null> = this.statusChanges.pipe(
    startWith(false),
    map(() => CommonHelper.instantError(this))
  );

  constructor(controls: AbstractControl[],
              validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
              asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
              formFactory?: (
                configs: AbstractField[],
                validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
              ) => ExtendedFormGroup
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    this.formFactory = formFactory;
  }

  public get(path: Array<string | number> | string): ExtendedFormControl {
    return super.get(path) as ExtendedFormControl;
  }

  public get canShowError(): boolean {
    return this.invalid && (this.touched || this.dirty);
  }

  public get isChangedByUser(): boolean {
    if (this.fieldConfig && typeof this.fieldConfig.checkChanges === 'function') {
      return this.fieldConfig.checkChanges(this.defaultValuePatched, this.value);
    }

    return this.defaultValuePatched && this.controls.some(control => control.isChangedByUser);
  }

  public patchValue(value: { [key: string]: any }[], options: { onlySelf?: boolean, emitEvent?: boolean, useAsDefault?: boolean } = {}): void {
    if (!Array.isArray(value)) {
      return;
    }

    if (options.useAsDefault) {
      this.defaultValuePatched = true;
    }

    for (let i = this.controls.length; i < value.length; i++) {
      this.addControl();
    }

    value.forEach(((newValue, index) => {
      if (this.at(index)) {
        this.at(index).patchValue(newValue, { ...options, onlySelf: true });
      }
    }));

    this.updateValueAndValidity(options);

    this.lastPatchedValue = value;
  }

  public validate(scrollToError: boolean = false): boolean {
    this.markAllAsTouched();
    this.updateValueAndValidity({ onlySelf: true });

    if (scrollToError && this.invalid) {
      this.scrollToError();
    }

    return this.valid;
  }

  public scrollToError(): void {
    const invalidControl = CommonHelper.getFirstInvalidControl(this);
    if (invalidControl) {
      invalidControl.htmlInstance.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public resetDefaultValue(): void {
    this.defaultValuePatched = false;
    this.controls.forEach(control => control.resetDefaultValue());
  }

  public resetToDefaultValue(options: { onlySelf?: boolean, emitEvent?: boolean, useAsDefault?: boolean } = {}): void {
    this.controls.forEach(control => control.resetToDefaultValue({ onlySelf: true, ...options }));
  }

  public updateChildrenControls(): void {
    this.childrenControls = [...this.controls];
  }

  public addControl(): any {
    if (!this.formFactory) {
      console.error('ExtendedFormArray required formFactory');
      return;
    }

    const control = this.formFactory(this.fieldConfig.configs);

    if (this.disabled) {
      control.disable({ emitEvent: false });
    }

    this.push(control);
    this.controlAdded.emit(control);
    return control;
  }

  public enableAllControlByKey(key: string): void {
    // @ts-ignore
    this.controls.forEach(control => control.get(key).enable());
  }

  public removeAllControls(): void {
    while (this.controls.length !== 0) {
      this.removeAt(0);
    }
  }
}
