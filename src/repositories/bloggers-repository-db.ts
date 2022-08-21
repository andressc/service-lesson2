import { bloggersCollection } from '../db/db';
import { BloggersType } from '../types/bloggersType';

export const postsRepository = {
	async findAllBloggers(): Promise<BloggersType[]> {
		return bloggersCollection.find({}).toArray();
	},

	async findBloggerById(id: number): Promise<BloggersType | null> {
		const blogger: BloggersType | null = await bloggersCollection.findOne({
			id,
		});

		if (blogger) {
			return blogger;
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
