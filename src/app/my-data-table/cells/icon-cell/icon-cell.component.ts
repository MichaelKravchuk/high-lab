import { Component, Input } from '@angular/core';
import { DataTableCellComponent } from 'dynamic-table';
import { IconCell } from './icon-cell';

@Component({
	selector: 'icon-cell',
	templateUrl: './icon-cell.component.html',
	styleUrls: ['./icon-cell.component.scss']
})
export class IconCellComponent extends DataTableCellComponent {
	@Input()
	public cellConfig: IconCell;

	public get svgPathArray(): string[] {
		const v = this.cellConfig.svgPath(this.row);

		if (Array.isArray(v)) {
			return v;
		}

		return [v];
	}
}
