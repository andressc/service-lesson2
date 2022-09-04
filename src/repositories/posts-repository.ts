import { PostsType } from '../types/postsType';
import { PaginationCalc, PaginationType } from '../types/paginationType';
import { postsCollection } from '../db/db';

export const postsRepository = {
	async findAllPosts(data: PaginationCalc, searchString: {}): Promise<PostsType[]> {
		return await postsCollection
			.find(searchString, { projection: { _id: 0 } })
			.skip(data.skip)
			.limit(data.pageSize)
			.sort(data.sortBy)
			.toArray();
	},

	async findAllBloggersPosts(
		data: PaginationCalc,
		searchString: {},
	): Promise<PaginationType<PostsType[]>> {
		const items: PostsType[] = await postsCollection
			.find(searchString, { projection: { _id: 0 } })
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

	async findPostById(id: string): Promise<PostsType | null> {
		const post: PostsType | null = await postsCollection.findOne(
			{ id },
			{ projection: { _id: 0 } },
		);

		if (post) {
			return post;
		}

		return null;
	},

	async deletePost(id: string): Promise<boolean> {
		const result = await postsCollection.deleteOne({ id });
		return result.deletedCount === 1;
	},

	async deleteAllPosts(): Promise<boolean> {
		const result = await postsCollection.deleteMany({});
		return result.deletedCount === 1;
	},

	async updatePost(id: string, updateData: PostsType): Promise<boolean> {
		const result = await postsCollection.updateOne({ id }, { $set: updateData });
		return result.matchedCount === 1;
	},

	async createPost(newPost: PostsType): Promise<PostsType | null> {
		await postsCollection.insertOne({ ...newPost });
		return newPost;
	},

	async countPostData(search: {}): Promise<number> {
		return await postsCollection.countDocuments(search);
	},
};
