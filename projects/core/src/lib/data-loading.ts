import { Observable } from 'rxjs';

export interface ApiPagination {
    page?: number;
    firstPage?: boolean;
    lastPage?: boolean;
    pageSize?: number;
    totalElements?: number;
    totalPages?: number;
    sort?: string;
}

export interface Pagination<T = any> {
    data: T[];
    pagination: ApiPagination;
}

export interface FailureConfig {
    properties: { [key: string]: any };
    title?: string;
    second?: boolean;
}

function empty(v: any): boolean {
    return v === '' || (Array.isArray(v) && v.length === 0) || v === undefined || v === null || (typeof v === 'object' && Object.keys(v).length === 0);
}

export class LoadingProgress<T> {
    public static fromData<T>(value: T): LoadingProgress<T> {
        return new LoadingProgress<T>(true, true, false, value)
    }

    public get isLoading(): boolean {
        return !this.isLoaded;
    }

    public data: T extends Pagination ? T['data'] : T;
    public pagination: ApiPagination | null;
    public isEmptyData: boolean | null;

    constructor(
        public isLoaded: boolean = false,
        public isSuccess: boolean = false,
        public isFailure: boolean = false,
        data?: T,
        public failureConfig?: FailureConfig
    ) {
        if (this.hasPagination(data)) {
            this.data = data.data as any;
            this.pagination = data.pagination;
        } else {
            this.data = data as any;
        }

        this.isEmptyData = empty(this.data);
    }

    public clone<N>(params: {
        isLoaded?: boolean,
        isSuccess?: boolean,
        isFailure?: boolean,
        data: N,
        failureConfig?: FailureConfig
    } = {} as any): LoadingProgress<N> {
        return new LoadingProgress(
            params.isLoaded || this.isLoaded,
            params.isSuccess || this.isSuccess,
            params.isFailure || this.isFailure,
            params.data,
            params.failureConfig || this.failureConfig,
        );
    }

    private hasPagination(data: Pagination | T): data is Pagination {
        return data !== null && typeof data === 'object' && data.hasOwnProperty('pagination');
    }
}

export const dataLoading = <T>(
    callback: (loadingProgress: LoadingProgress<T>) => void,
    failureConfig?: FailureConfig
) => (source: Observable<T>) => {
    const tryCallCallback = (loadingProgress: LoadingProgress<T>) => {
        if (typeof callback === 'function') {
            callback(loadingProgress);
        }
    };

    tryCallCallback(new LoadingProgress(false, false, false));

    return new Observable<T>(observer => {
        return source.subscribe(
            v => {
                tryCallCallback(new LoadingProgress(true, true, false, v));
                observer.next(v);
            },
            err => {
                tryCallCallback(new LoadingProgress(true, false, true, null, failureConfig));

                observer.error(err);
            },
            () => {
                observer.complete();
            }
        );
    });
};
