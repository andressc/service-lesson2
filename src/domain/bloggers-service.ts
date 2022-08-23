import { bloggersRepository } from '../repositories/bloggers-repository-db';
import { BloggersType } from '../types/bloggersType';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { PostsType } from '../types/postsType';
import { postsRepository } from '../repositories/posts-repository-db';
import { idCreator } from '../helpers/idCreator';
import { postBodyFilter } from '../helpers/postBodyFilter';

export const bloggersService = {
	async findAllBloggers(query: PaginationTypeQuery): Promise<PaginationType<BloggersType[]>> {
		return bloggersRepository.findAllBloggers(query);
	},

	async findAllPostsBlogger(
		query: PaginationTypeQuery,
		id: number | null = null,
	): Promise<PaginationType<PostsType[]>> {
		return postsRepository.findAllPosts(query, id);
	},

	async findBloggerById(id: number): Promise<BloggersType | null> {
		return bloggersRepository.findBloggerById(id);
	},

	async deleteBlogger(id: number): Promise<boolean> {
		return await bloggersRepository.deleteBlogger(id);
	},

	async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
		return await bloggersRepository.updateBlogger(id, name, youtubeUrl);
	},

	async createBlogger(name: string, youtubeUrl: string): Promise<number> {
		const newBlogger = { id: +new Date(), name, youtubeUrl };

		return await bloggersRepository.createBlogger(newBlogger);
	},

	async createBloggerPost(id: number, body: PostsType): Promise<PostsType | null> {
		const blogger: BloggersType | null = await bloggersService.findBloggerById(id);
		if (!blogger) {
			return null;
		}

		return await postsRepository.createPost({
			id: idCreator(),
			...postBodyFilter(body),
			bloggerId: blogger.id,
			bloggerName: blogger.name,
		});
	},
};
