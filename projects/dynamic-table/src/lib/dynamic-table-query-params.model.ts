import { StrictModel, StrictProperty } from '@high-lab/strict-model';
import { DataTableQueryParams, DataTableQueryParamsMapping } from './interfaces';

export class DynamicTableQueryParamsModel extends StrictModel {
	@StrictProperty(Number)
	public page: number;

	@StrictProperty(Number)
	public pageSize: number;

	@StrictProperty(String)
	public sort: string;

	constructor(options,
				public mapping: DataTableQueryParamsMapping,
				public defaultValues: DataTableQueryParams,
	) {
		super({
			page: options[mapping.page] ?? defaultValues.page,
			pageSize: options[mapping.pageSize] ?? defaultValues.pageSize,
			sort: options[mapping.sort] ?? defaultValues.sort,
		}, false);
	}

	public toString(questionMark?: boolean): string {
		let str = `${this.mapping.page}=${this.page}&` +
			`${this.mapping.pageSize}=${this.pageSize}&` +
			`${this.mapping.sort}=${this.sort}`;

		return (questionMark ? '?' : '') + str;
	}

	public toJSON(): Partial<DynamicTableQueryParamsModel> {
		return Object.entries(super.toJSON()).reduce((acc, [key, value]) => {
			if (value !== '' && value !== null) {
				acc[this.mapping[key]] = value;
			}
			return acc;
		}, {});
	}
}