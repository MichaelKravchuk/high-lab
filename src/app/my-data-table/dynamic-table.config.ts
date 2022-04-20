import { DataTableConfig } from 'dynamic-table';
import {
	DateCell,
	DateCellComponent,
	IconCell,
	IconCellComponent,
	StringCell,
	StringCellComponent,
	TemplateCell,
	TemplateCellComponent
} from './cells';

export const MY_DATA_TABLE_CONFIG: DataTableConfig = [
	{ component: StringCellComponent, config: StringCell },
	{ component: DateCellComponent, config: DateCell },
	{ component: IconCellComponent, config: IconCell },
	{ component: TemplateCellComponent, config: TemplateCell },
]