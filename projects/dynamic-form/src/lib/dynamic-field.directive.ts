import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { AbstractField } from './base.field';
import { NewComponent } from './dynamic-form.config';
import { ExtendedFormArray, ExtendedFormGroup } from './form-controls';
import { DYNAMIC_FORM_CONFIG_MAP } from './injectors';
import { DynamicFormTemplate } from './interfaces';


@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnChanges {
  public component!: ComponentRef<any>;

  @Input()
  public fieldConfig!: AbstractField;

  @Input()
  public formGroup!: ExtendedFormGroup | ExtendedFormArray;

  @Input()
  public template!: DynamicFormTemplate;

  @Input()
  public rowIndex!: number;

  constructor(private readonly viewContainerRef: ViewContainerRef,
              private readonly componentFactoryResolver: ComponentFactoryResolver,
              @Inject(DYNAMIC_FORM_CONFIG_MAP)
              private readonly componentsByConfig: Map<any, NewComponent>,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.fieldConfig && changes.fieldConfig.currentValue) {
      const constructor = (this.fieldConfig as any).constructor;
      if (!this.componentsByConfig.get(constructor)) {
        throw new Error(
          `Trying to use an unsupported type (${constructor}).`
        );
      }

      const component = this.componentFactoryResolver.resolveComponentFactory(
        this.componentsByConfig.get(constructor) as any
      );

      this.component = this.viewContainerRef.createComponent(component);
      this.setComponentProps();
    }
  }

  public setComponentProps() {
    this.component.instance.fieldConfig = this.fieldConfig;
    this.component.instance.formGroup = this.formGroup;
    this.component.instance.template = this.template;
    this.component.instance.rowIndex = this.rowIndex;
  }
}
