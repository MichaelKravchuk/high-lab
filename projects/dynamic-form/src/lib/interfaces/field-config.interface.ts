import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { AbstractField, GroupField } from '../base.field';
import { ValidationMessages } from '../dynamic-form.config';
import { ExtendedControls } from '../form-controls';

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
  checkChanges?: (currentValue: any, defaultValue: any) => boolean;
  autofocus?: boolean;
  data?: any;
  ignore?: boolean;
}

export interface ControlFieldInterface extends AbstractFieldInterface {
  label?: string | ((form: AbstractControl) => string);
  tooltip?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export interface GroupFieldInterface extends AbstractFieldInterface {
  data?: any;
  configs: Array<AbstractField>;
}

export interface ArrayFieldInterface extends  AbstractFieldInterface {
  configs: AbstractField | ((value) => AbstractField);
}

export interface RelatedFieldInterface {
  configs: AbstractField[] | RelatedFieldsConfigFunction;
  checkVisibility: RelatedFieldsCheckVisibilityFunction;
}

type RelatedFieldsCheckVisibilityFunction = (currentValue: any, prevValue: any, control: ExtendedControls) => boolean;
type RelatedFieldsConfigFunction = (currentValue: any, prevValue: any, control: ExtendedControls) => AbstractField[];

export interface FieldOption<T = any> {
  label: string;
  value: T;
}

export interface ErrorObject {
  message: string;
  params: any;
  key: string;
}
