import { TemplateRef } from '@angular/core';

export interface TemplateWithChildren {
  ref: TemplateRef<any>,
  children: DynamicFormTemplate;
}

export interface DynamicFormTemplate {
  [key: string]: TemplateRef<any> | TemplateWithChildren | DynamicFormTemplate;
}
