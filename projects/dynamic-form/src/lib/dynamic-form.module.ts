import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent, EditableFieldDirective } from './base.component';
import { DynamicFieldDirective } from './dynamic-field.directive';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormConfig, ValidationMessagesFn } from './dynamic-form.config';
import { DynamicFormContentDirective } from './dynamic-from-content.directive';
import { DYNAMIC_FORM_CONFIG, DYNAMIC_FORM_CONFIG_MAP, DYNAMIC_FORM_VALIDATION_MESSAGES } from './injectors';


@NgModule({
  declarations: [DynamicFormComponent, DynamicFieldDirective, BaseFieldComponent, DynamicFormContentDirective, EditableFieldDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [DynamicFormComponent, BaseFieldComponent, DynamicFieldDirective, DynamicFormContentDirective, EditableFieldDirective]
})
export class DynamicFormModule {

  public static config(
    dynamicFormConfig: DynamicFormConfig,
    validationMessages?: ValidationMessagesFn
  ): ModuleWithProviders<DynamicFormModule> {
    const dynamicFormConfigMap = new Map(dynamicFormConfig.map(v => ([v.config, v.component])));
    return {
      ngModule: DynamicFormModule,
      providers: [
        { provide: DYNAMIC_FORM_CONFIG, useValue: dynamicFormConfig },
        { provide: DYNAMIC_FORM_CONFIG_MAP, useValue: dynamicFormConfigMap },
        { provide: DYNAMIC_FORM_VALIDATION_MESSAGES, useValue: validationMessages || {} },
      ]
    };
  }
}
