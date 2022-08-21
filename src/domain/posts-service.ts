import { PostsType } from '../types/postsType';
import { postsRepository } from '../repositories/posts-repository-db';

export const postsService = {
	async findAllPosts(): Promise<PostsType[]> {
		return postsRepository.findAllPosts();
	},

	async findPostById(id: number): Promise<PostsType | null> {
		return postsRepository.findPostById(id);
	},

	async deletePost(id: number): Promise<boolean> {
		return await postsRepository.deletePost(id);
	},

	async updatePost(
		id: number,
		title: string,
		shortDescription: string,
		content: string,
		bloggerId: number,
		bloggerName: string,
	): Promise<boolean> {
		return await postsRepository.updatePost(
			id,
			title,
			shortDescription,
			content,
			bloggerId,
			bloggerName,
		);
	},

	async createPost(
		title: string,
		shortDescription: string,
		content: string,
		bloggerId: number,
		bloggerName: string,
	): Promise<number> {
		const newPost = {
			id: +new Date(),
			title,
			shortDescription,
			content,
			bloggerId,
			bloggerName,
		};

		return await postsRepository.createPost(newPost);
	},
};
