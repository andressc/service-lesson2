import { blogsCollection } from '../db/db';
import { BlogsType } from '../types/blogsType';
import { PaginationCalc, PaginationType } from '../types/paginationType';

export const blogsRepository = {
	async findAllBlogs(data: PaginationCalc, searchString: {}): Promise<PaginationType<BlogsType[]>> {
		const items: BlogsType[] = await blogsCollection
			.find(searchString, { projection: { _id: 0 } })
			.skip(data.skip)
			.limit(data.pageSize)
			.sort(data.sortBy)
			.collation({ locale: 'en_US', numericOrdering: true })
			.toArray();

		return {
			pagesCount: data.pagesCount,
			page: data.pageNumber,
			pageSize: data.pageSize,
			totalCount: data.totalCount,
			items,
		};
	},

	async findBlogById(id: string): Promise<BlogsType | null> {
		const blog: BlogsType | null = await blogsCollection.findOne(
			{ id },
			{ projection: { _id: 0 } },
		);

		if (blog) {
			return blog;
		}

		return null;
	},

	async deleteBlog(id: string) {
		const result = await blogsCollection.deleteOne({ id });
		return result.deletedCount === 1;
	},

	async deleteAllBlogs(): Promise<boolean> {
		const result = await blogsCollection.deleteMany({});
		return result.deletedCount === 1;
	},

	async updateBlog(id: string, name: string, youtubeUrl: string) {
		const result = await blogsCollection.updateOne({ id }, { $set: { name, youtubeUrl } });
		return result.matchedCount === 1;
	},

	async createBlog(newBlog: BlogsType) {
		await blogsCollection.insertOne({ ...newBlog });
		return newBlog;
	},

	async countBlogData(search: {}): Promise<number> {
		return await blogsCollection.countDocuments(search);
	},
};
