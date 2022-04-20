import { TableCell, TableCellInterface } from './table-cell';
import { DataTableCellComponent } from './data-table-cell.component';

export interface DataTableCellConfig {
	component: new (...params: any) => DataTableCellComponent,
	config: new (options: TableCellInterface) => TableCell,
}

export type DataTableConfig = DataTableCellConfig[];