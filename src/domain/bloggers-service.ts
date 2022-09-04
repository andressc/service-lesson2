import { BloggersType } from '../types/bloggersType';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { PostsType } from '../types/postsType';
import { postsRepository } from '../repositories/posts-repository';
import { idCreator } from '../helpers/idCreator';
import { postBodyFilter } from '../helpers/postBodyFilter';
import { bloggersRepository } from '../repositories/bloggers-repository';
import { paginationCalc } from '../helpers/paginationCalc';
import { postsService } from './posts-service';

export const bloggersService = {
	async findAllBloggers(query: PaginationTypeQuery): Promise<PaginationType<BloggersType[]>> {
		const searchString = query.searchNameTerm
			? { name: { $regex: query.searchNameTerm.toString() } }
			: {};

		const totalCount = await bloggersRepository.countBloggerData(searchString);

		const data = paginationCalc({ ...query, totalCount });

		return await bloggersRepository.findAllBloggers(data, searchString);
	},

	async findAllPostsBlogger(
		query: PaginationTypeQuery,
		id: string | null = null,
	): Promise<PaginationType<PostsType[]>> {
		return postsService.findAllPosts(query, id);
	},

	async findBloggerById(id: string): Promise<BloggersType | null> {
		return bloggersRepository.findBloggerById(id);
	},

	async deleteBlogger(id: string): Promise<boolean> {
		return await bloggersRepository.deleteBlogger(id);
	},

	async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
		return await bloggersRepository.updateBlogger(id, name, youtubeUrl);
	},

	async createBlogger(name: string, youtubeUrl: string): Promise<BloggersType> {
		const newBlogger = { id: idCreator(), name, youtubeUrl, createdAt: new Date().toISOString() };

		return await bloggersRepository.createBlogger(newBlogger);
	},

	async createBloggerPost(id: string, body: PostsType): Promise<PostsType | null> {
		const blogger = await bloggersService.findBloggerById(id);
		if (!blogger) {
			return null;
		}

		return await postsRepository.createPost({
			id: idCreator(),
			...postBodyFilter(body),
			bloggerId: blogger.id,
			bloggerName: blogger.name,
			createdAt: new Date().toISOString(),
		});
	},
};
