import { PostsType } from '../types/postsType';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { postsCollection } from '../db/db';
import { paginationCalc } from '../helpers/paginationCalc';

export const postsRepository = {
	async findAllPosts(
		query: PaginationTypeQuery,
		id: number | null,
	): Promise<PaginationType<PostsType[]>> {
		const searchString = id ? { bloggerId: id } : {};

		const totalCount = await postsCollection.countDocuments(searchString);

		const { pagesCount, page, pageSize, skip } = paginationCalc({ ...query, totalCount });

		const project = {
			_id: 0,
			id: 1,
			title: 1,
			shortDescription: 1,
			content: 1,
			bloggerId: 1,
			bloggerName: 1,
		};

		//const items: PostsType[] = await postsCollection
		const items: any = await postsCollection
			.find(searchString)
			.project(project)
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

	async findPostById(id: number): Promise<PostsType | null> {
		const post: PostsType | null = await postsCollection.findOne({ id });

		if (post) {
			return post;
		}

		return null;
	},

	async deletePost(id: number): Promise<boolean> {
		const result = await postsCollection.deleteOne({ id });
		return result.deletedCount === 1;
	},

	async updatePost(id: number, updateData: PostsType): Promise<boolean> {
		const result = await postsCollection.updateOne({ id }, { $set: updateData });
		return result.matchedCount === 1;
	},

	async createPost(newPost: PostsType): Promise<PostsType | null> {
		await postsCollection.insertOne(newPost);
		return newPost;
	},
};
