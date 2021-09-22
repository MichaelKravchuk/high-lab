import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { AbstractField, GroupField } from '../base.field';
import { ValidationMessages } from '../dynamic-form.config';

export interface AbstractFieldInterface {
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null;
    key: string;
    order?: number;
    internalOrder?: number;
    initialValue?: any;
    validationMessages?: ValidationMessages;
    relatedFields?: RelatedFieldInterface[];
    class?: string;
}

export interface BaseFieldInterface extends AbstractFieldInterface {
    label?: string | ((form: AbstractControl) => string);
    tooltip?: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
}

export interface GroupFieldInterface extends AbstractFieldInterface {
    data?: any;
    configs: Array<AbstractField | GroupField>;
}

export interface RelatedFieldInterface {
    configs: AbstractField[] | RelatedFieldsConfigFunction;
    checkVisibility: RelatedFieldsCheckVisibilityFunction | string | number | boolean | Array<string & number>;
}

type RelatedFieldsCheckVisibilityFunction = (value: any, control: AbstractControl) => boolean;
type RelatedFieldsConfigFunction = (value: any, control: AbstractControl) => AbstractField[];

export interface FieldOption<T = any> {
    label: string;
    value: T;
}
