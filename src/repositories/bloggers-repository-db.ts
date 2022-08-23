import { bloggersCollection, postsCollection } from '../db/db';
import { BloggersType } from '../types/bloggersType';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { paginationCalc } from '../helpers/paginationCalc';

export const bloggersRepository = {
	async findAllBloggers(query: PaginationTypeQuery): Promise<PaginationType<BloggersType[]>> {
		const searchString = query.searchNameTerm
			? { name: { $regex: query.searchNameTerm.toString() } }
			: {};
		const totalCount = await bloggersCollection.countDocuments(searchString);

		const { pagesCount, page, pageSize, skip } = paginationCalc({ ...query, totalCount });

		const items: BloggersType[] = await bloggersCollection
			.find(searchString)
			.skip(skip)
			.limit(pageSize)
			.toArray();

		return {
			pagesCount,
			page,
			pageSize,
			totalCount,
			items,
		};
	},

	async findBloggerById(id: number): Promise<BloggersType | null> {
		const blogger: BloggersType | null = await bloggersCollection.findOne({
			id,
		});

		if (blogger) {
			const { id, name, youtubeUrl } = blogger;
			return { id, name, youtubeUrl };
		}

		return null;
	},

	async deleteBlogger(id: number): Promise<boolean> {
		const result = await bloggersCollection.deleteOne({ id });
		return result.deletedCount === 1;
	},

	async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
		const result = await bloggersCollection.updateOne({ id }, { $set: { name, youtubeUrl } });
		return result.matchedCount === 1;
	},

	async createBlogger(newBlogger: BloggersType): Promise<number> {
		await bloggersCollection.insertOne(newBlogger);
		return newBlogger.id;
	},
};
