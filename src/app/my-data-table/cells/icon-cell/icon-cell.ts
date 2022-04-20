import { TableCell, TableCellInterface } from 'dynamic-table';

interface IconCellInterface extends TableCellInterface {
	svgPath?: (row: any) => string | string[];
	iconClass?: string;
}

export class IconCell extends TableCell implements IconCellInterface{
	public svgPath?: (row: any) => string | string[];
	public iconClass?: string;

	constructor(options: IconCellInterface) {
		super(options);
		this.svgPath = options.svgPath;
		this.iconClass = options.iconClass;
	}
}