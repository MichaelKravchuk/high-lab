import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { ValidationMessages } from './dynamic-form.config';
import { ExtendedFormArray, ExtendedFormControl, ExtendedFormGroup } from './form-controls';
import {
  AbstractFieldInterface, ArrayFieldInterface,
  ControlFieldInterface,
  GroupFieldInterface,
  RelatedFieldInterface
} from './interfaces/field-config.interface';

export type NewFormControl = new (...params: any) => ExtendedFormControl | ExtendedFormArray | ExtendedFormGroup;


export class AbstractField implements AbstractFieldInterface {
  public formControl: NewFormControl;
  public validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
  public asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null;
  public key: string;
  public order: number | undefined;
  public internalOrder?: number;
  public initialValue?: any;
  public validationMessages?: ValidationMessages;
  public relatedFields?: RelatedFieldInterface[];
  public class?: string;
  public checkChanges?: (defaultValue: any, currentValue: any) => boolean;

  constructor(options: AbstractFieldInterface) {
    this.validatorOrOpts = options.validatorOrOpts;
    this.asyncValidator = options.asyncValidator;
    this.key = options.key;
    this.order = options.order;
    this.initialValue = options.initialValue;
    this.validationMessages = options.validationMessages;
    this.relatedFields = options.relatedFields;
    this.class = options.class;
    this.checkChanges = options.checkChanges;
    this.formControl = ExtendedFormControl;
  }
}


export class ControlField extends AbstractField implements ControlFieldInterface {
  private readonly labelFn?: (form: AbstractControl) => string;
  private readonly labelString?: string;

  public tooltip?: string;
  public placeholder?: string;
  public minLength?: number;
  public maxLength?: number;

  constructor(options: ControlFieldInterface) {
    super(options);

    if (typeof options.label === 'function') {
      this.labelFn = options.label;
    } else {
      this.labelString = options.label;
    }

    this.tooltip = options.tooltip;
    this.placeholder = options.placeholder;
    this.minLength = options.minLength;
    this.maxLength = options.maxLength;
    this.formControl = ExtendedFormControl;
  }

  public label(form: AbstractControl): string {
    if (this.labelFn) {
      return this.labelFn(form.value);
    }

    return this.labelString as any;
  }
}


export class GroupField extends AbstractField implements GroupFieldInterface {
  public configs: Array<AbstractField>;

  constructor(options: GroupFieldInterface) {
    super(options);
    this.configs = options.configs;
    this.formControl = ExtendedFormGroup;
  }
}


export class ArrayField extends AbstractField implements ArrayFieldInterface {
  public configs: Array<AbstractField>;

  constructor(options: ArrayFieldInterface) {
    super(options)
    this.configs = options.configs;
    this.formControl = ExtendedFormArray;
  }
}
