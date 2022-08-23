export type PaginationType<T> = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: T;
};

export type PaginationTypeQuery = {
	pageNumber: number;
	pageSize: number;
	totalCount: number;
	id?: number | null;
	searchNameTerm?: number | null;
};
