import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataTableCellDirective } from './data-table-cell.directive';
import { DataTableConfig } from './data-table.config';
import { DATA_TABLE_CONFIG, DATA_TABLE_CONFIG_MAP } from './injectors';
import { DynamicTableComponent } from './dynamic-table.component';


@NgModule({
	declarations: [
		DynamicTableComponent,
		DataTableCellDirective,
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatProgressBarModule
	],
	exports: [DynamicTableComponent]
})
export class DynamicTableModule {
	public static config(
		dataTableConfig: DataTableConfig,
	): ModuleWithProviders<DynamicTableModule> {
		const dataTableConfigMap = new Map(dataTableConfig.map(v => ([v.config, v.component])));

		return {
			ngModule: DynamicTableModule,
			providers: [
				{ provide: DATA_TABLE_CONFIG, useValue: dataTableConfig },
				{ provide: DATA_TABLE_CONFIG_MAP, useValue: dataTableConfigMap },
			]
		};
	}
}
