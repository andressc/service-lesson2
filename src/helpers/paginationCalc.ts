import { PaginationTypeQuery } from '../types/paginationType';

export const paginationCalc = (data: PaginationTypeQuery) => {
	let { pageNumber, pageSize, totalCount } = data;

	pageNumber = +pageNumber;
	pageSize = +pageSize;

	if (!pageNumber) {
		pageNumber = 1;
	}

	if (!pageSize) {
		pageSize = 10;
	}

	const skip = (pageNumber - 1) * pageSize;
	const pagesCount = Math.ceil(totalCount / pageSize);

	return { pagesCount, page: pageNumber, pageSize: pageSize, skip };
};
