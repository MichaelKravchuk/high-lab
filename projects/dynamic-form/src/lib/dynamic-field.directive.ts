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
import { BaseField } from './base.field';
import { NewComponent } from './dynamic-form.config';
import { ExtendedFormGroup } from './form-controls';


@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnChanges {
  public component!: ComponentRef<any>;

  @Input()
  public fieldConfig!: BaseField;

  @Input()
  public formGroup!: ExtendedFormGroup;

  @Input()
  public template!: TemplateRef<any>;

  @Input()
  public hideLabel!: boolean;

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
      if (!this.componentsByConfig.get(this.fieldConfig.type)) {
        throw new Error(
          `Trying to use an unsupported type (${this.fieldConfig.type}).`
        );
      }

      const component = this.componentFactoryResolver.resolveComponentFactory(
        this.componentsByConfig.get(this.fieldConfig.type) as any
      );

      this.component = this.viewContainerRef.createComponent(component);
      this.setComponentProps();
    }
  }

  public setComponentProps() {
    this.component.instance.fieldConfig = this.fieldConfig;
    this.component.instance.formGroup = this.formGroup;
    this.component.instance.template = this.template;
    this.component.instance.hideLabel = this.hideLabel;
    this.component.instance.rowIndex = this.rowIndex;
  }
}
