import { PaginationTypeQuery } from '../types/paginationType';

export const paginationCalc = (data: PaginationTypeQuery) => {
	const sortDirection = data.sortDirection === 'Asc' ? 1 : -1;
	const sortBy = data.sortBy ? { [data.sortBy]: sortDirection } : { createdAt: sortDirection };

	let pageNumber = +data.pageNumber;
	let pageSize = +data.pageSize;
	let totalCount = +data.totalCount;

	if (!pageNumber) {
		pageNumber = 1;
	}

	if (!pageSize) {
		pageSize = 10;
	}

	const skip = (pageNumber - 1) * pageSize;
	const pagesCount = Math.ceil(totalCount / pageSize);

	return { pagesCount, pageNumber, pageSize, skip, sortBy, totalCount };
};
