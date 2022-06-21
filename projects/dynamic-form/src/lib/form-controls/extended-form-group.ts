import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { GroupField } from '../base.field';
import { ValidationMessages } from '../dynamic-form.config';
import { CommonHelper, RandomHelper } from '../helpers';
import { ErrorObject } from '../interfaces';
import { ExtendedControls } from './index';


export class ExtendedFormGroup extends FormGroup {
  public readonly supposeControls = new Map<string, Subject<ExtendedControls>>();
  public readonly id = RandomHelper.NumId;
  public pathFromRoot!: string;
  public defaultValidationMessages: ValidationMessages = {};
  public controls!: { [key: string]: ExtendedControls };
  public fieldConfig!: GroupField;
  public lastPatchedValue: { [key: string]: any } | undefined;
  public defaultValuePatched = false;
  public htmlInstance!: HTMLElement;
  public childrenControls: Array<ExtendedControls> = [];

  public error: Observable<string | null> = this.statusChanges.pipe(
    startWith(false),
    map(() => CommonHelper.instantError(this, true))
  );

  public errorObject: Observable<ErrorObject | null> = this.statusChanges.pipe(
    startWith(false),
    map(() => CommonHelper.instantError(this, false))
  );

  public get canShowError(): boolean {
    return this.invalid && (this.touched || this.dirty);
  }

  public get isChangedByUser(): boolean {
    if (this.fieldConfig && typeof this.fieldConfig.checkChanges === 'function') {
      return this.fieldConfig.checkChanges(this.value, this.defaultValuePatched);
    }

    for (const control of Object.values(this.controls)) {
      if (control.isChangedByUser) {
        return true;
      }
    }

    return false;
  }

  public get(path: Array<string | number> | string): ExtendedControls {
    return super.get(path) as any;
  }

  public patchValue(value: { [key: string]: any }, options: { onlySelf?: boolean, emitEvent?: boolean, useAsDefault?: boolean } = {}): void {
    if (value == null /* both `null` and `undefined` */) {
      return;
    }

    if (options.useAsDefault) {
      this.defaultValuePatched = true;
    }

    Object.keys(value).forEach(name => {
      if (this.controls[name]) {
        this.controls[name].patchValue(value[name], { ...options, onlySelf: true });
      }
    });

    this.updateValueAndValidity(options);

    this.lastPatchedValue = value;
  }

  public validate(scrollToError: boolean = true): boolean {
    this.markAllAsTouched();
    this.updateValueAndValidity({ onlySelf: true });

    if (scrollToError && this.invalid) {
      this.scrollToError();
    }

    return this.valid;
  }

  public resetDefaultValue(): void {
    this.defaultValuePatched = false;
    Object.values(this.controls).forEach(control => control.resetDefaultValue());
  }

  public resetToDefaultValue(options: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    Object.values(this.controls).forEach(control => control.resetToDefaultValue({ ...options, onlySelf: true }));
    this.updateValueAndValidity();
  }

  public scrollToError(): void {
    const invalidControl = CommonHelper.getFirstInvalidControl(this);
    if (invalidControl) {
      invalidControl.htmlInstance.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public updateChildrenControls(): void {
    this.childrenControls = Object.values(this.controls);

    this.childrenControls.sort((a: any, b: any) => {
      if (a.fieldConfig.internalOrder < b.fieldConfig.internalOrder) {
        return -1;
      } else if (a.fieldConfig.internalOrder > b.fieldConfig.internalOrder) {
        return 1;
      }

      return 0;
    });
  }

  public getControl(path: string[]): Observable<any> {
    const pathStr = this.pathFromRoot + path.join('.');
    const root = this.root as ExtendedFormGroup;

    if (!root.supposeControls.has(pathStr)) {
      root.supposeControls.set(pathStr, new Subject());
    }

    const subject = root.supposeControls.get(pathStr) as Subject<any>;
    return subject.pipe(
      filter(v => !!v)
    );
  }

  public getRawValue(params = { ignoredFields: false }): any {
    return this.childrenControls.reduce((acc, control) => {
      if (!control.fieldConfig.ignore || params.ignoredFields) {
        (acc as any)[control.fieldConfig.key] = (control as any).getRawValue(params);
      }
      return acc;
    }) as any;
  }
}