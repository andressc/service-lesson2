import { bloggersCollection } from '../db/db';
import { BloggersType } from '../types/bloggersType';
import { PaginationCalc, PaginationType } from '../types/paginationType';

export const bloggersRepository = {
	async findAllBloggers(
		data: PaginationCalc,
		searchString: {},
	): Promise<PaginationType<BloggersType[]>> {
		const items: BloggersType[] = await bloggersCollection
			.find(searchString, { projection: { _id: 0, passwordHash: 0 } })
			.skip(data.skip)
			.limit(data.pageSize)
			.sort(data.sortBy)
			.toArray();

		return {
			pagesCount: data.pagesCount,
			page: data.pageNumber,
			pageSize: data.pageSize,
			totalCount: data.totalCount,
			items,
		};
	},

	async findBloggerById(id: string): Promise<BloggersType | null> {
		const blogger: BloggersType | null = await bloggersCollection.findOne(
			{ id },
			{ projection: { _id: 0 } },
		);

		if (blogger) {
			return blogger;
		}

		return null;
	},

	async deleteBlogger(id: string) {
		const result = await bloggersCollection.deleteOne({ id });
		return result.deletedCount === 1;
	},

	async deleteAllBloggers(): Promise<boolean> {
		const result = await bloggersCollection.deleteMany({});
		return result.deletedCount === 1;
	},

	async updateBlogger(id: string, name: string, youtubeUrl: string) {
		const result = await bloggersCollection.updateOne({ id }, { $set: { name, youtubeUrl } });
		return result.matchedCount === 1;
	},

	async createBlogger(newBlogger: BloggersType) {
		await bloggersCollection.insertOne({ ...newBlogger });
		return newBlogger;
	},

	async countBloggerData(search: {}): Promise<number> {
		return await bloggersCollection.countDocuments(search);
	},
};
