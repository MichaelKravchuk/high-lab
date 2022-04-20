import { Component } from '@angular/core';
import { DataTableCellComponent } from 'dynamic-table';

@Component({
	selector: 'date-cell',
	templateUrl: './date-cell.component.html',
	styleUrls: ['./date-cell.component.scss']
})
export class DateCellComponent extends DataTableCellComponent {
}
