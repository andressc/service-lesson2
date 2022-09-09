import { Request, Response, Router } from 'express';
import { blogsService } from '../domain/blogs-service';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';
import { blogsValidationMiddleware } from '../middlewares/blogs-validation-middleware';
import { BlogsType } from '../types/blogsType';
import { basicAuthorizationValidationMiddleware } from '../middlewares/basic-authorization-validation-middleware';
import { PostsType } from '../types/postsType';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { postsValidationMiddleware } from '../middlewares/posts-validation-middleware';

export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request<{}, {}, {}, PaginationTypeQuery>, res: Response) => {
	const blogs = await blogsService.findAllBlogs(req.query);
	res.send(blogs);
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
	const blog: BlogsType | null = await blogsService.findBlogById(req.params.id);

	if (blog) {
		return res.send(blog);
	}

	return res.sendStatus(404);
});

blogsRouter.get(
	'/:id/posts',
	async (req: Request<{ id: string }, {}, {}, PaginationTypeQuery>, res: Response) => {
		const blogPosts: PaginationType<PostsType[]> | boolean = await blogsService.findAllPostsBlog(
			req.query,
			req.params.id,
		);

		if (blogPosts) {
			return res.send(blogPosts);
		}

		return res.sendStatus(404);
	},
);

blogsRouter.delete(
	'/:id',
	basicAuthorizationValidationMiddleware,
	async (req: Request, res: Response) => {
		const isDeleted: boolean = await blogsService.deleteBlog(req.params.id);
		if (isDeleted) {
			return res.send(204);
		}

		return res.sendStatus(404);
	},
);

blogsRouter.post(
	'/',
	basicAuthorizationValidationMiddleware,
	...blogsValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const blog: BlogsType = await blogsService.createBlog(req.body.name, req.body.youtubeUrl);

		if (blog) {
			return res.status(201).send(blog);
		}

		return res.sendStatus(404);
	},
);

blogsRouter.post(
	'/:id/posts',
	basicAuthorizationValidationMiddleware,
	...postsValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const blogsPost: PostsType | null = await blogsService.createBlogPost(req.params.id, req.body);

		if (blogsPost) {
			return res.status(201).send(blogsPost);
		}

		return res.sendStatus(404);
	},
);

blogsRouter.put(
	'/:id',
	basicAuthorizationValidationMiddleware,
	...blogsValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const isUpdated: boolean = await blogsService.updateBlog(
			req.params.id,
			req.body.name,
			req.body.youtubeUrl,
		);
		if (isUpdated) {
			return res.send(204);
		}

		res.sendStatus(404);
	},
);
