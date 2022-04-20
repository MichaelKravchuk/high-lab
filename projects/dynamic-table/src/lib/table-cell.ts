export interface TableCellInterface {
	key: string;
	label: string | ((row: any) => string);
	sort?: boolean;
	defaultSort?: boolean;
	value?: ((row: any) => any);
	class?: string;
	stopRowEventPropagation?: boolean;
}

export class TableCell implements TableCellInterface {
	public key: string;
	public label: string | ((row: any) => string);
	public sort?: boolean;
	public defaultSort?: boolean;
	public value?: ((row: any) => any)
	public class?: string;
	public stopRowEventPropagation?: boolean;

	constructor(options: TableCellInterface) {
		this.key = options.key;
		this.label = options.label;
		this.sort = options.sort;
		this.defaultSort = options.defaultSort;
		this.value = options.value;
		this.class = options.class;
		this.stopRowEventPropagation = options.stopRowEventPropagation
	}
}