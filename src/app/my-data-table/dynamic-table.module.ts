import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DynamicTableModule } from 'dynamic-table';
import { MY_DATA_TABLE_CONFIG } from './dynamic-table.config';
import { StringCellComponent, DateCellComponent, IconCellComponent, TemplateCellComponent } from './cells';

const components = [
	StringCellComponent,
	DateCellComponent,
	IconCellComponent,
	TemplateCellComponent
]

@NgModule({
	declarations: [
		...components
	],
	imports: [
		CommonModule,
		DynamicTableModule.config(MY_DATA_TABLE_CONFIG),
		MatIconModule
	],
	exports: [
		...components,
		DynamicTableModule
	]
})
export class MyDynamicTableModule {
}
