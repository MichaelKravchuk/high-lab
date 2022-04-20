import { Component, ContentChildren, EventEmitter, Output, QueryList, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'data-table-head',
  templateUrl: './data-table-head.component.html',
  styleUrls: ['./data-table-head.component.scss']
})
export class DataTableHeadComponent{
  @Output()
  public click = new EventEmitter();

  @ViewChild('headRef', { static: true })
  public readonly headRef: TemplateRef<any>;

  @ContentChildren(TemplateRef)
  public templateQueryList: QueryList<TemplateRef<any>>;

  public ngAfterViewInit() {
  }

  public onClick(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.stopImmediatePropagation();
    this.click.emit(evt);
  }
}
