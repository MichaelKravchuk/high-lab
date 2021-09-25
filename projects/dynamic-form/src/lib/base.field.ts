import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { ValidationMessages } from './dynamic-form.config';
import { ExtendedFormArray, ExtendedFormControl, ExtendedFormGroup } from './form-controls';
import {
  AbstractFieldInterface,
  BaseFieldInterface,
  GroupFieldInterface,
  RelatedFieldInterface
} from './interfaces/field-config.interface';

export type NewFormControl = new (...params: any) => ExtendedFormControl | ExtendedFormArray | ExtendedFormGroup;


export class AbstractField implements AbstractFieldInterface {
  public static readonly type: string;

  public formControl: NewFormControl = ExtendedFormControl;
  public validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
  public asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null;
  public key: string;
  public order: number | undefined;
  public internalOrder?: number;
  public initialValue?: any;
  public validationMessages?: ValidationMessages;
  public relatedFields?: RelatedFieldInterface[];
  public class?: string;

  constructor(options: AbstractFieldInterface) {
    this.validatorOrOpts = options.validatorOrOpts;
    this.asyncValidator = options.asyncValidator;
    this.key = options.key;
    this.order = options.order;
    this.initialValue = options.initialValue;
    this.validationMessages = options.validationMessages;
    this.relatedFields = options.relatedFields;
    this.class = options.class;
  }

  public get type(): string {
    return this.constructor.name;
  }
}


export class BaseField extends AbstractField implements BaseFieldInterface {
  private readonly labelFn?: (form: AbstractControl) => string;
  private readonly labelString?: string;

  public tooltip?: string;
  public placeholder?: string;
  public minLength?: number;
  public maxLength?: number;

  constructor(options: BaseFieldInterface) {
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
  }

  public label(form: AbstractControl): string {
    if (this.labelFn) {
      return this.labelFn(form.value);
    }

    return this.labelString as any;
  }
}


export class GroupField extends AbstractField implements GroupFieldInterface {
  public data: any;
  public configs: Array<AbstractField | GroupField>;

  constructor(options: GroupFieldInterface) {
    super(options);
    this.data = options.data;
    this.configs = options.configs;
  }
}
