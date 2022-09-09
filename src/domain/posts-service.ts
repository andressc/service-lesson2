import { PostsType } from '../types/postsType';
import { postsRepository } from '../repositories/posts-repository';
import { blogsService } from './blogs-service';
import { idCreator } from '../helpers/idCreator';
import { postBodyFilter } from '../helpers/postBodyFilter';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { UsersType } from '../types/usersType';
import { usersService } from './users-service';
import { CommentsType } from '../types/commentsType';
import { commentsRepository } from '../repositories/comments-repository';
import { paginationCalc } from '../helpers/paginationCalc';

export const postsService = {
	async findAllPosts(
		query: PaginationTypeQuery,
		id: string | null = null,
	): Promise<PaginationType<PostsType[]>> {
		const searchString = id ? { blogId: id } : {};

		const totalCount = await postsRepository.countPostData(searchString);

		const data = paginationCalc({ ...query, totalCount });

		return await postsRepository.findAllPosts(data, searchString);
	},

	async findAllCommentsOfPost(
		query: PaginationTypeQuery,
		id: string,
	): Promise<PaginationType<CommentsType[]> | boolean> {
		const post = await postsService.findPostById(id);
		if (!post) {
			return false;
		}

		const searchString = { postId: id };

		const totalCount = await commentsRepository.countCommentsData(searchString);

		const data = paginationCalc({ ...query, totalCount });

		return commentsRepository.findAllComments(data, searchString);
	},

	async findPostById(id: string): Promise<PostsType | null> {
		return postsRepository.findPostById(id);
	},

	async deletePost(id: string): Promise<boolean> {
		return await postsRepository.deletePost(id);
	},

	async updatePost(id: string, body: PostsType): Promise<boolean> {
		const blog = await blogsService.findBlogById(body.blogId);
		if (!blog) {
			return false;
		}

		return await postsRepository.updatePost(id, {
			id, //подумать
			...postBodyFilter(body),
			blogName: blog.name,
		});
	},

	async createPost(body: PostsType): Promise<PostsType | null> {
		const blog = await blogsService.findBlogById(body.blogId);
		if (!blog) {
			return null;
		}

		return await postsRepository.createPost({
			id: idCreator(),
			...postBodyFilter(body),
			blogName: blog.name,
			createdAt: new Date().toISOString(),
		});
	},

	async createCommentPost(content: string, authUser: null | UsersType, postId: string) {
		if (!authUser) {
			return null;
		}

		const user = await usersService.findUserById(authUser.id);
		if (!user) {
			return null;
		}

		const post = await postsService.findPostById(postId);
		if (!post) {
			return null;
		}

		const newComment: CommentsType = {
			id: idCreator(),
			content,
			userId: user.id,
			userLogin: user.login,
			postId: post.id,
			createdAt: new Date().toISOString(),
		};

		return await commentsRepository.createComment(newComment);
	},
};
