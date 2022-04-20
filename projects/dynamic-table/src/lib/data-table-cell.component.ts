import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { SubscriptionHelper } from '@high-lab/core';
import { TableCell } from './table-cell';


@Component({
	template: '',
})
export class DataTableCellComponent implements OnInit, OnDestroy {
	private readonly subscriptionHelper = new SubscriptionHelper();

	@Input()
	public cellConfig: TableCell;

	@Input()
	public row!: any;

	@Input()
	public template!: TemplateRef<any>;

	@HostBinding('class')
	public get cellClass(): string {
		return `cell ${this.cellConfig.class || ''}`
	};

	@HostBinding('attr.stopRowEventPropagation')
	public get stopRowEventPropagation(): boolean {
		return this.cellConfig.stopRowEventPropagation;
	}

	constructor(private readonly elementRef: ElementRef,
				private readonly renderer2: Renderer2) {
	}

	public ngOnInit() {
		if (this.cellConfig.stopRowEventPropagation) {
			this.subscriptionHelper.next = this.renderer2.listen(this.elementRef.nativeElement, 'click', evt => {
				evt.stopPropagation();
			})

			this.subscriptionHelper.next = this.renderer2.listen(this.elementRef.nativeElement, 'mouseover', evt => {
				evt.stopPropagation();
			})

			this.subscriptionHelper.next = this.renderer2.listen(this.elementRef.nativeElement, 'mouseout', evt => {
				evt.stopPropagation();
			})
		}
	}

	public ngOnDestroy() {
		this.subscriptionHelper.unsubscribeAll();
	}

	public get displayValue(): string {
		if (typeof this.cellConfig.value === 'function') {
			return this.cellConfig.value(this.row);
		}

		return this.row[this.cellConfig.key];
	}

	public get hasTemplateRef(): boolean {
		return !!this.template && this.template instanceof TemplateRef
	}

	public get templateRef(): TemplateRef<any> | null {
		if (this.template instanceof TemplateRef) {
			return this.template;
		}

		return null;
	}
}
