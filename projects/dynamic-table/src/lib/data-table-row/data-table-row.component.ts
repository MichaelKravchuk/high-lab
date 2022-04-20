import {
    Component,
    ContentChildren,
    EventEmitter, Input,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';


@Component({
    selector: 'data-table-row',
    templateUrl: './data-table-row.component.html',
    styleUrls: ['./data-table-row.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DataTableRowComponent {
    @Input()
    public hover: boolean = true;

    @Output()
    public click = new EventEmitter();

    @ViewChild('rowRef', { static: true })
    public readonly rowRef: TemplateRef<any>;

    @ContentChildren(TemplateRef)
    public templateQueryList: QueryList<TemplateRef<any>>;
}
