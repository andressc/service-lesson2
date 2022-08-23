export type PaginationType<T> = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: T;
};

export type PaginationTypeQuery = {
	PageNumber: number;
	PageSize: number;
	totalCount: number;
	id?: number | null;
	SearchNameTerm?: number | null;
};
