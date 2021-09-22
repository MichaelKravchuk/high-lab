import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BaseField } from '../base.field';
import { CommonHelper, RandomHelper } from '../helpers';

export class ExtendedFormControl extends FormControl {
    public readonly id = RandomHelper.NumId;
    public pathFromRoot!: string;
    public fieldConfig!: BaseField;
    public defaultValue: any = null;
    public defaultValuePatched!: boolean;
    public htmlInstance!: HTMLElement;

    public error: Observable<string | null> = this.statusChanges.pipe(
        startWith(false),
        map(() => CommonHelper.instantError(this))
    );

    public get canShowError(): boolean {
        return this.invalid && (this.touched || this.dirty);
    }

    public get isChangedByUser(): boolean {
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

    public resetToDefaultValue(options: { onlySelf?: boolean, emitEvent?: boolean, useAsDefault?: boolean } = {}): void {
        this.patchValue(this.defaultValue, options);
    }
}
