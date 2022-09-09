import { BlogsType } from '../types/blogsType';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { PostsType } from '../types/postsType';
import { postsRepository } from '../repositories/posts-repository';
import { idCreator } from '../helpers/idCreator';
import { postBodyFilter } from '../helpers/postBodyFilter';
import { blogsRepository } from '../repositories/blogs-repository';
import { paginationCalc } from '../helpers/paginationCalc';
import { postsService } from './posts-service';

export const blogsService = {
	async findAllBlogs(query: PaginationTypeQuery): Promise<PaginationType<BlogsType[]>> {
		const searchString = query.searchNameTerm
			? { name: { $regex: query.searchNameTerm, $options: 'i' } }
			: {};

		const totalCount = await blogsRepository.countBlogData(searchString);

		const data = paginationCalc({ ...query, totalCount });

		return await blogsRepository.findAllBlogs(data, searchString);
	},

	async findAllPostsBlog(
		query: PaginationTypeQuery,
		id: string,
	): Promise<PaginationType<PostsType[]> | boolean> {
		const blog = await blogsService.findBlogById(id);
		if (!blog) {
			return false;
		}

		return postsService.findAllPosts(query, id);
	},

	async findBlogById(id: string): Promise<BlogsType | null> {
		return blogsRepository.findBlogById(id);
	},

	async deleteBlog(id: string): Promise<boolean> {
		return await blogsRepository.deleteBlog(id);
	},

	async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
		return await blogsRepository.updateBlog(id, name, youtubeUrl);
	},

	async createBlog(name: string, youtubeUrl: string): Promise<BlogsType> {
		const newBlog = { id: idCreator(), name, youtubeUrl, createdAt: new Date().toISOString() };

		return await blogsRepository.createBlog(newBlog);
	},

	async createBlogPost(id: string, body: PostsType): Promise<PostsType | null> {
		const blog = await blogsService.findBlogById(id);
		if (!blog) {
			return null;
		}

		return await postsRepository.createPost({
			id: idCreator(),
			...postBodyFilter(body),
			blogId: blog.id,
			blogName: blog.name,
			createdAt: new Date().toISOString(),
		});
	},
};
