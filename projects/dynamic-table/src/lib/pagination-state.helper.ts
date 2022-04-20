export class PaginationStateHelper {
    public page: number;
    public pageCount: number;
    public pageArray: Array<{ isNumber: boolean, value: number }> = [];

    constructor(public range: number) {}


    public get isFirstPage(): boolean {
        return this.page === 1;
    };

    public get isLastPage(): boolean {
        return this.page === this.pageCount;
    };

    public setPage(value: number): number {
        if (value < 1) {
            this.page = 1;
        } else if (value > this.pageCount) {
            this.page = this.pageCount;
        } else {
            this.page = value;
        }

        this.updateState();

        return this.page;
    }

    public setPageCount(value: number): void {
        if (value < 1) {
            this.pageCount = 1;
        } else {
            this.pageCount = value;
        }

        if (this.page > this.pageCount) {
            this.page = this.pageCount;
        }

        this.updateState();
    }

    public prevPage(): number {
        if (!this.isFirstPage) {
            this.page--;
            this.updateState();
        }

        return this.page;
    }

    public nextPage(): number {
        if (!this.isLastPage) {
            this.page++;
            this.updateState();
        }

        return this.page;
    }

    private updateState(): void {
        this.pageArray = [];

        if (this.pageCount < this.range * 2 + 3) {
            for (let i = 1; i <= this.pageCount; i++) {
                this.pageArray.push({isNumber: true, value: i});
            }
        } else if (this.page < this.range * 2 - 1) {
            for (let i = 1; i <= this.range * 2 + 1; i++) {
                this.pageArray.push({isNumber: true, value: i});
            }

            this.pageArray.push({ isNumber: false, value: null });
            this.pageArray.push({ isNumber: true, value: this.pageCount });
        } else if (this.page > this.pageCount - this.range - 2) {
            this.pageArray.push({ isNumber: true, value: 1 });
            this.pageArray.push({ isNumber: false, value: null });

            for (let i = this.pageCount - this.range * 2; i <= this.pageCount; i++) {
                this.pageArray.push({isNumber: true, value: i});
            }
        } else {
            this.pageArray.push({ isNumber: true, value: 1 });
            this.pageArray.push({ isNumber: false, value: null });

            for (let i = this.page - this.range + 1; i < this.page + this.range; i++) {
                this.pageArray.push({isNumber: true, value: i});
            }

            this.pageArray.push({ isNumber: false, value: null });
            this.pageArray.push({ isNumber: true, value: this.pageCount });
        }
    }
}