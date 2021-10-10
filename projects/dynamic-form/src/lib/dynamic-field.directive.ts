import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { AbstractField } from './base.field';
import { NewComponent } from './dynamic-form.config';
import { ExtendedFormArray, ExtendedFormGroup } from './form-controls';


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
  public template!: TemplateRef<any>;

  @Input()
  public rowIndex!: number;

  @Input()
  public componentsByConfig!: Map<string, NewComponent>;

  constructor(private readonly viewContainerRef: ViewContainerRef,
              private readonly componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.componentsByConfig && changes.componentsByConfig.currentValue) {
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
