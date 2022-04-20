import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output, QueryList,
	SimpleChanges,
	TemplateRef, ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingProgress, Pagination, SubscriptionHelper } from '@high-lab/core';
import { paginationFadeInAnimation, paginationFadeOutAnimation } from './animations';
import { DataTableCellComponent } from './data-table-cell.component';
import { DynamicTableQueryParamsModel } from './dynamic-table-query-params.model';
import { DATA_TABLE_CONFIG_MAP } from './injectors';
import { DataTableQueryParams, DataTableQueryParamsMapping } from './interfaces';
import { PaginationStateHelper } from './pagination-state.helper';
import { SortStateHelper } from './sort-state.helper';
import { TableCell } from './table-cell';


@Component({
	selector: 'dynamic-table',
	templateUrl: './dynamic-table.component.html',
	styleUrls: ['./dynamic-table.component.scss'],
	animations: [paginationFadeInAnimation(), paginationFadeOutAnimation()],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTableComponent<T> implements OnChanges, OnInit, OnDestroy {
	protected readonly subscriptionHelper = new SubscriptionHelper();

	protected innerActivatedRoute: ActivatedRoute;
	protected preventEmitEvent: boolean;
	public queryParamsModel: DynamicTableQueryParamsModel;
	public lastRenderedSizes: number[] = [];

	public paginationState: PaginationStateHelper;
	public sortState = new SortStateHelper();
	public firstInit = true;
	public hoverIndex: number;
	public emptyRows: number[] = null;

	@Input()
	public dataSource: LoadingProgress<Pagination<T>>;

	@Input()
	public table: TableCell[];

	@Input()
	public templates: { [key: string]: TemplateRef<{ row: any }> };

	@Input()
	public fillEmpty: boolean;

	@Input()
	public fixSizeByLoading: boolean;

	@Input()
	public rowHeight = 56;

	@Input()
	public queryParamsMapping: DataTableQueryParamsMapping = {
		page: 'page',
		pageSize: 'pageSize',
		sort: 'sort'
	};

	@Input()
	public set activatedRoute(value: ActivatedRoute) {
		this.innerActivatedRoute = value;
	}

	public get activatedRoute(): ActivatedRoute {
		return this.innerActivatedRoute || this.selfActivatedRoute;
	}

	@Input()
	public trackBy: (index: number, row: any) => any = (index, row) => {
		return row;
	}

	@Output()
	public requestPageData = new EventEmitter<DynamicTableQueryParamsModel>();

	@Output()
	public rowClick = new EventEmitter<T>();

	@ViewChildren('thRef')
	public thRef: QueryList<ElementRef<HTMLTableHeaderCellElement>>;

	constructor(private readonly elementRef: ElementRef,
	            private readonly changeDetectorRef: ChangeDetectorRef,
	            private readonly router: Router,
	            private readonly selfActivatedRoute: ActivatedRoute,
	            @Inject(DATA_TABLE_CONFIG_MAP)
	            private readonly componentsByConfig: Map<any, DataTableCellComponent>,
	) {}

	public async ngOnInit() {
		this.queryParamsModel = this.getQueryParamsModel();
		await this.updateRouterQueryParams(true, true);

		this.subscriptionHelper.next = this.activatedRoute.queryParams.subscribe(() => {
			const newQueryParamsModel = this.getQueryParamsModel();

			if (this.queryParamsModel.toString() !== newQueryParamsModel.toString()) {
				this.queryParamsModel = newQueryParamsModel;
				this.requestPageData.emit(this.queryParamsModel);

				if (this.paginationState) {
					this.paginationState.page = this.queryParamsModel.page;
				}

				this.sortState.fromString(this.queryParamsModel.sort);
			}
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.dataSource && changes.dataSource.currentValue && this.dataSource.isSuccess) {
			if (!this.paginationState) {
				this.paginationState = new PaginationStateHelper(4)
			}

			this.paginationState.setPageCount(this.dataSource.pagination.totalPages);
			this.paginationState.setPage(this.dataSource.pagination.page);
			this.sortState.fromString(this.dataSource.pagination.sort);

			if (this.fixSizeByLoading) {
				this.updateLastRenderedSizes();
			}

			if (this.fillEmpty) {
				this.emptyRows = new Array(this.dataSource.pagination.pageSize - this.dataSource.data.length).fill(null);
			} else {
				this.emptyRows = null;
			}

			let updateRouterQueryParams = false;

			if (this.sortState.toString() !== this.queryParamsModel.sort) {
				this.queryParamsModel.sort = this.sortState.toString();
				updateRouterQueryParams = true;
			}

			if (this.paginationState.page !== this.queryParamsModel.page) {
				this.queryParamsModel.page = this.paginationState.page;
				updateRouterQueryParams = true;
			}

			if (updateRouterQueryParams) {
				this.updateRouterQueryParams();
			}

			this.changeDetectorRef.detectChanges();
			this.firstInit = false;
		}

		if (changes.queryParamsMapping) {
			this.queryParamsModel = this.getQueryParamsModel();
		}
	}

	public ngOnDestroy() {
		this.subscriptionHelper.unsubscribeAll();
	}

	public get countOfRows(): number {
		const count = Math.floor(this.elementRef.nativeElement.getBoundingClientRect().height / this.rowHeight) - 2;

		if (count <= 0) {
			return 1;
		}

		return count;
	}

	public get tableHeight(): string {
		if (this.dataSource.isLoading || this.dataSource.isEmptyData ||
			this.dataSource.isFailure || this.countOfRows === this.dataSource.data.length ||
			this.fillEmpty
		) {
			return '100%';
		}

		return 'auto';
	}

	public get skeletonRows(): number[] {
		return new Array(this.countOfRows);
	}

	public trackPaginationBy = (index, item) => {
		return item.value;
	}

	public getWidth(index) {
		if (!this.fixSizeByLoading || !this.lastRenderedSizes[index] || this.dataSource.isLoaded) {
			return 'auto';
		}

		return `${this.lastRenderedSizes[index]}px`;
	}

	public onClick(event: MouseEvent, row: any) {
		this.rowClick.next(row);
	}

	public onMouseOver(evt: MouseEvent, rowIndex: number): void {
		if (this.hoverIndex !== rowIndex) {
			this.hoverIndex = rowIndex;
			this.changeDetectorRef.detectChanges();
		}
	}


	public onMouseOut(): void {
		if (this.hoverIndex !== null) {
			this.hoverIndex = null;
			this.changeDetectorRef.detectChanges();
		}
	}

	public onPaginationChange(nextPage: number): void {
		this.queryParamsModel.page = nextPage;
		this.updateRouterQueryParams(false);
	}

	public onSortChange(cell: TableCell): void {
		if (!cell.sort) {
			return;
		}

		this.sortState.update(cell.key);
		this.queryParamsModel.sort = this.sortState.toString();
		this.updateRouterQueryParams(false);
	}

	private getQueryParamsModel(): DynamicTableQueryParamsModel {
		return new DynamicTableQueryParamsModel(this.activatedRoute.snapshot.queryParams, this.queryParamsMapping, this.getDefaultQueryParams())
	}

	private getDefaultQueryParams(): DataTableQueryParams {
		const defaultSort = this.table.find(v => v.defaultSort)?.key;
		const firstSort = this.table.find(v => v.sort)?.key;
		const sort = defaultSort || firstSort || '';

		return {
			page: 1,
			pageSize: this.countOfRows,
			sort: `${sort}${sort ? ',desc' : ''}`,
		}
	}

	private updateRouterQueryParams(replaceUrl = true, emitEvent = false): Promise<boolean> {
		const allQueryParams = { ...this.activatedRoute.snapshot.queryParams };
		const newQueryParams = this.queryParamsModel.toJSON();

		if (!newQueryParams.hasOwnProperty(this.queryParamsMapping.sort)) {
			delete allQueryParams[this.queryParamsMapping.sort];
		}

		if (!replaceUrl || emitEvent) {
			this.requestPageData.emit(this.queryParamsModel);
		}

		return this.router.navigate(['./'], {
			replaceUrl,
			queryParams: { ...allQueryParams, ...newQueryParams },
			relativeTo: this.activatedRoute,
		});
	}

	private updateLastRenderedSizes(): void {
		requestAnimationFrame(() => {
			this.lastRenderedSizes = [];
			this.thRef.forEach(item => this.lastRenderedSizes.push(item.nativeElement.getBoundingClientRect().width));
		})
	}
}
