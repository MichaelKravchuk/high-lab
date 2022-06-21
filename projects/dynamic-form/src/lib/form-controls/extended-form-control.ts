import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ControlField } from '../base.field';
import { CommonHelper, RandomHelper } from '../helpers';
import { ErrorObject } from '../interfaces';

export class ExtendedFormControl extends FormControl {
	public readonly id = RandomHelper.NumId;
	public pathFromRoot!: string;
	public fieldConfig!: ControlField;
	public defaultValue: any = null;
	public defaultValuePatched!: boolean;
	public htmlInstance!: HTMLElement;

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
			return this.fieldConfig.checkChanges(this.value, this.defaultValue);
		}

		return !(this.defaultValue === this.value || (this.defaultValue === null && this.value === ''));
	}

	public patchValue(value: any, options: {
		onlySelf?: boolean,
		emitEvent?: boolean,
		emitModelToViewChange?: boolean,
		emitViewToModelChange?: boolean,
		useAsDefault?: boolean
	} = {}): void {
		if (options.useAsDefault) {
			this.defaultValue = value;
			this.defaultValuePatched = true;
		}

		this.setValue(value, options);
	}

	public resetDefaultValue(): void {
		this.defaultValue = undefined;
		this.defaultValuePatched = false;
	}

	public resetToDefaultValue(options: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
		this.patchValue(this.defaultValue, options);
	}

	public getRawValue(params = { ignoredFields: false }): any {
		return this.value
	}
}
