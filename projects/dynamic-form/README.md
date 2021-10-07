# Angular Dynamic Form

An angular 10+ module that allows to generate forms by config

[![npm version](https://badge.fury.io/js/@high-lab%2Fdynamic-form.svg)](//npmjs.com/package/@high-lab/dynamic-form)
[![GitHub issues](https://img.shields.io/github/issues/MichaelKravchuk/high-lab.svg)](https://github.com/MichaelKravchuk/high-lab/issues)
[![GitHub stars](https://img.shields.io/github/stars/MichaelKravchuk/high-lab.svg)](https://github.com/MichaelKravchuk/high-lab/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/MichaelKravchuk/high-lab/master/LICENSE)

## Demo
http://high-lab.com.ua/dynamic-form

## Usage


**Step 1:** Install @high-lab/dynamic-form

```sh
npm install @high-lab/dynamic-form --save
```

**Step 2:** Import angular dynamic form module into your app module,
provide default validation messages,
and your custom components for each config type

```ts
...
import { DynamicFormModule } from '@high-lab/dynamic-form';
...

import { DynamicFormConfig } from '@high-lab/dynamic-form';
import {
  FormGroupField,
  FormGroupFieldComponent,
  CheckboxField,
  CheckboxFieldComponent,
  NumberField,
  NumberFieldComponent,
  TextField,
  TextFieldComponent,
  ...
} from './fields';

export const MY_DYNAMIC_FORM_CONFIG: DynamicFormConfig = [
  { component: FormGroupFieldComponent, config: FormGroupField },
  { component: CheckboxFieldComponent, config: CheckboxField },
  { component: NumberFieldComponent, config: NumberField },
  { component: TextFieldComponent, config: TextField },
  ...
];

export function VALIDATION_MESSAGES() {
  return {
    required: 'This field can’t be blank.',
    min: params => `Value must be greater than ${params.min}`,
    ...
  };
}

@NgModule({
    ...
    imports: [
        ...
        DynamicFormModule.config(MY_DYNAMIC_FORM_CONFIG, VALIDATION_MESSAGES),
    ],
    ...
})
export class AppModule { }
```

**Example of config:** All your config must extend ```AbstractField``` or ```ControlField``` class

```ts
import { ControlField, ControlFieldInterface } from '@high-lab/dynamic-form';

export type CheckboxFieldInterface = ControlFieldInterface;

export class CheckboxField extends ControlField {
  public static readonly type = 'checkbox';

  constructor(options: CheckboxFieldInterface) {
    super(options);
  }
}
```

**Example of control:** All your control components must extend ```BaseFieldComponent``` class

```ts
import { Component, Input } from '@angular/core';
import { BaseFieldComponent } from '@high-lab/dynamic-form';
import { CheckboxField } from './checkbox-field';

@Component({
  selector: 'checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.scss']
})
export class CheckboxFieldComponent extends BaseFieldComponent {
  @Input()
  public readonly fieldConfig: CheckboxField;
}
```
**checkbox-field template**

```html
<ng-container *dynamicFormContent="self" [formGroup]="formGroup">
  <mat-checkbox class="checkbox" color="primary" [formControlName]="fieldConfig.key">{{label}}</mat-checkbox>
</ng-container>

```

**Step 3:** Use in your app

```html
<dynamic-form [form]="form">
  <div class="action-buttons" formFooter>
    <button mat-stroked-button (click)="skipChanges()" [disabled]="!form.isChangedByUser || null">Cancel</button>
    <button mat-raised-button color="primary" (click)="save($event)" [disabled]="!form.isChangedByUser || null">Save</button>
  </div>
</dynamic-form>
```

```ts
import { createDynamicForm, ExtendedFormGroup } from '@high-lab/dynamic-form';

export class SomeComponent implements OnChanges, OnDestroy {
  public form: ExtendedFormGroup;

  constructor() {
    this.form = createDynamicForm(SOME_FORM(someConfig));
  }
}

export const SOME_FORM = (someConfig: any): AbstractField[] => [
  ...
  new NumberField({
    key: 'age',
    label: `Age`,
    order: 1,
    min: 12,
    max: 150,
    initialValue: { value: '', disabled: someConfig.ageDisabled },
    validatorOrOpts: [Validators.min(0), Validators.max(150)],
    relatedFields: [{
      checkVisibility: (value, formValue) => value >= 18,
      configs: [
        new TextField({
          key: 'someKey',
          label: `Some Label`,
          order: 2,
        }),
      ]
    } , {
      checkVisibility: (value, formValue) => value >= 60,
      configs: [
        new TextField({
          key: 'someKey',
          label: `Some Label 2`,
          order: 2,
        }),
        new FormGroupField({
          key: 'size',
          order: 3,
          configs: [
            new NumberField({
              key: 'width',
              label: `Width`,
              initialValue: 30,
            }),
            new NumberField({
              key: 'height',
              label: `Height`,
              initialValue: 30,
            })
          ]
        }),
      ]
    }]
  })
];
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
