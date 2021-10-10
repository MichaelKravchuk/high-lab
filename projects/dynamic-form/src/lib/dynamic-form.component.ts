import { Component, Inject, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { DynamicFieldConfig, NewComponent, ValidationMessagesFn } from './dynamic-form.config';
import { ExtendedControls, ExtendedFormGroup } from './form-controls';
import { DYNAMIC_FORM_CONFIG, DYNAMIC_FORM_VALIDATION_MESSAGES } from './injectors';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnChanges {
  public readonly componentsByConfig = new Map<any, NewComponent>();

  @Input()
  public form!: ExtendedFormGroup;

  @Input()
  public templates: { [key: string]: TemplateRef<any> | { [key: string]: TemplateRef<any> } } = {} as any;

  constructor(@Inject(DYNAMIC_FORM_CONFIG)
              private readonly config: DynamicFieldConfig[],
              @Inject(DYNAMIC_FORM_VALIDATION_MESSAGES)
              private readonly validationMessages: ValidationMessagesFn
  ) {
    this.config.forEach(v => this.componentsByConfig.set(v.config, v.component));
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.form && changes.form.currentValue) {
      const root = changes.form.currentValue.root as ExtendedFormGroup;
      root.defaultValidationMessages = this.validationMessages();
    }
  }

  public getTemplate(key: string): any {
    return this.templates[key];
  }

  public trackByKeyFn(index: number, control: ExtendedControls) {
    return control.id;
  }
}
