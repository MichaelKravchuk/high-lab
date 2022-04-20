import { ChangeDetectorRef, Component } from '@angular/core';
import { LoadingProgress, Pagination, SubscriptionHelper } from 'core';
import { DynamicTableQueryParamsModel } from 'dynamic-table';
import { eventArchiveTable } from './event-archive.meta';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	private readonly subscriptionHelper = new SubscriptionHelper();

	public data = new LoadingProgress<Pagination>();
	public table = eventArchiveTable;

	constructor(private readonly cd: ChangeDetectorRef,
	) {
	}

	public trackBy = (index, row) => {
		return row.id;
	}

	public onClick(e): void {
		console.log(e);
	}

	public onTdClick(): void {
		console.log('onTdClick');
	}

	public onDataRequested(evt: DynamicTableQueryParamsModel): void {
		console.log('onDataRequested');
		this.subscriptionHelper.unsubscribeAll();
		this.data = new LoadingProgress(true, true, false, {
			data: [{}],
			pagination: { currentPage: 1, totalPages: 1 }
		});
		this.cd.detectChanges()
	}

	public get g(): string {
		return 's';
	}
}
