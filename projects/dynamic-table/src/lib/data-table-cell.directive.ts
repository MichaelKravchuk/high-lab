import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Inject,
  Input,
  OnChanges,
  SimpleChanges, TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { DataTableCellComponent } from './data-table-cell.component';
import { TableCell } from './table-cell';
import { DATA_TABLE_CONFIG_MAP } from './injectors';


@Directive({
  selector: '[cell]'
})
export class DataTableCellDirective implements OnChanges {
  public component!: ComponentRef<any>;

  @Input()
  public cellConfig!: TableCell;

  @Input()
  public row!: any;

  @Input()
  public template!: TemplateRef<any>;

  constructor(private readonly viewContainerRef: ViewContainerRef,
              private readonly componentFactoryResolver: ComponentFactoryResolver,
              @Inject(DATA_TABLE_CONFIG_MAP)
              private readonly componentsByConfig: Map<any, DataTableCellComponent>,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.cellConfig && changes.cellConfig.currentValue) {
      const constructor = (this.cellConfig as any).constructor;
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
    this.component.instance.cellConfig = this.cellConfig;
    this.component.instance.row = this.row;
    this.component.instance.template = this.template;
  }
}
