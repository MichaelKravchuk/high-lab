import { Component, OnInit } from '@angular/core';
import { DataTableCellComponent } from 'dynamic-table';

@Component({
	selector: 'string-cell',
	templateUrl: './string-cell.component.html',
	styleUrls: ['./string-cell.component.scss']
})
export class StringCellComponent extends DataTableCellComponent {
}
