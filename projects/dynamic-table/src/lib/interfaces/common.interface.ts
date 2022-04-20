export interface DataTableQueryParams {
	page: number;
	pageSize: number;
	sort: string;
}

export interface DataTableQueryParamsMapping {
	page: string;
	pageSize: string;
	sort: string;
}

export interface DataTableQueryParamsMappingReversed {
	[key: string]: 'page' | 'sort' | 'pageSize';
}
