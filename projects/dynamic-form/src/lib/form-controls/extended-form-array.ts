import { AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ArrayField } from '../base.field';
import { CommonHelper, RandomHelper } from '../helpers';

import { ExtendedFormControl, ExtendedFormGroup } from './index';

export class ExtendedFormArray extends FormArray {
  public readonly id = RandomHelper.NumId;

  private lastPatchedValue: any;

  public pathFromRoot!: string;
  public controls!: Array<ExtendedFormGroup>;
  public childrenControls!: Array<ExtendedFormGroup>;
  public fieldConfig!: ArrayField;
  public canAddRow: (() => boolean) | boolean = true;
  public defaultValuePatched = false;
  public htmlInstance!: HTMLElement;

  public error: Observable<string | null> = this.statusChanges.pipe(
    startWith(false),
    map(() => CommonHelper.instantError(this))
  );

  constructor(public formGroupFabric: () => ExtendedFormGroup,
              validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
              asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super([], validatorOrOpts, asyncValidator);
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

    for (let i = this.controls.length; i > value.length; i--) {
      this.removeControl(i - 1);
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
    if (!this.defaultValuePatched) {
      return;
    }

    if (Array.isArray(this.lastPatchedValue)) {
      for (let i = this.controls.length; i > this.lastPatchedValue.length; i--) {
        this.removeControl(i - 1);
      }

      for (let i = this.controls.length; i < this.lastPatchedValue.length; i++) {
        this.addControl();
      }

      this.controls.forEach((control, index) => {
        control.patchValue(this.lastPatchedValue[index], { onlySelf: true, useAsDefault: true, ...options })
      });

      this.updateValueAndValidity({ onlySelf: true });
    }
  }

  public updateChildrenControls(): void {
    this.childrenControls = [...this.controls];
  }

  public addControl(): any {
    const control = this.formGroupFabric();

    if (this.disabled) {
      control.disable({ emitEvent: false });
    }

    this.push(control);
    return control;
  }

  public removeControl(index: number): void {
    this.removeAt(index)
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
