import { Component, OnInit } from '@angular/core';
import { DataTableCellComponent } from 'dynamic-table';

@Component({
	selector: 'template-cell',
	templateUrl: './template-cell.component.html',
	styleUrls: ['./template-cell.component.scss'],
})
export class TemplateCellComponent extends DataTableCellComponent {
}
