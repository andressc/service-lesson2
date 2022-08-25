import { PostsType } from '../types/postsType';
import { postsRepository } from '../repositories/posts-repository';
import { bloggersService } from './bloggers-service';
import { idCreator } from '../helpers/idCreator';
import { postBodyFilter } from '../helpers/postBodyFilter';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';

export const postsService = {
	async findAllPosts(
		query: PaginationTypeQuery,
		id: string | null = null,
	): Promise<PaginationType<PostsType[]>> {
		return postsRepository.findAllPosts(query, id);
	},

	async findPostById(id: string): Promise<PostsType | null> {
		return postsRepository.findPostById(id);
	},

	async deletePost(id: string): Promise<boolean> {
		return await postsRepository.deletePost(id);
	},

	async updatePost(id: string, body: PostsType): Promise<boolean> {
		const blogger = await bloggersService.findBloggerById(body.bloggerId);
		if (!blogger) {
			return false;
		}

		return await postsRepository.updatePost(id, {
			id, //подумать
			...postBodyFilter(body),
			bloggerName: blogger.name,
		});
	},

	async createPost(body: PostsType): Promise<PostsType | null> {
		const blogger = await bloggersService.findBloggerById(body.bloggerId);
		if (!blogger) {
			return null;
		}

		return await postsRepository.createPost({
			id: idCreator(),
			...postBodyFilter(body),
			bloggerName: blogger.name,
		});
	},
};
