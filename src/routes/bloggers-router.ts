import { Request, Response, Router } from 'express';
import { bloggersService } from '../domain/bloggers-service';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';
import { bloggersValidationMiddleware } from '../middlewares/bloggers-validation-middleware';
import { BloggersType } from '../types/bloggersType';
import { basicAuthorizationValidationMiddleware } from '../middlewares/basic-authorization-validation-middleware';
import { PostsType } from '../types/postsType';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { postsValidationMiddleware } from '../middlewares/posts-validation-middleware';

export const bloggersRouter = Router({});

bloggersRouter.get('/', async (req: Request<{}, {}, {}, PaginationTypeQuery>, res: Response) => {
	const bloggers = await bloggersService.findAllBloggers(req.query);
	res.send(bloggers);
});

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
	const blogger: BloggersType | null = await bloggersService.findBloggerById(req.params.id);

	if (blogger) {
		return res.send(blogger);
	}

	return res.sendStatus(404);
});

bloggersRouter.get(
	'/:id/posts',
	async (req: Request<{ id: string }, {}, {}, PaginationTypeQuery>, res: Response) => {
		const bloggerPosts: PaginationType<PostsType[]> = await bloggersService.findAllPostsBlogger(
			req.query,
			req.params.id,
		);

		if (bloggerPosts.totalCount > 0) {
			return res.send(bloggerPosts);
		}

		return res.sendStatus(404);
	},
);

bloggersRouter.delete(
	'/:id',
	basicAuthorizationValidationMiddleware,
	async (req: Request, res: Response) => {
		const isDeleted: boolean = await bloggersService.deleteBlogger(req.params.id);
		if (isDeleted) {
			return res.send(204);
		}

		return res.sendStatus(404);
	},
);

bloggersRouter.post(
	'/',
	basicAuthorizationValidationMiddleware,
	...bloggersValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const blogger: BloggersType = await bloggersService.createBlogger(
			req.body.name,
			req.body.youtubeUrl,
		);

		if (blogger) {
			return res.status(201).send(blogger);
		}

		return res.sendStatus(404);
	},
);

bloggersRouter.post(
	'/:id/posts',
	basicAuthorizationValidationMiddleware,
	...postsValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const bloggersPost: PostsType | null = await bloggersService.createBloggerPost(
			req.params.id,
			req.body,
		);

		if (bloggersPost) {
			return res.status(201).send(bloggersPost);
		}

		return res.sendStatus(404);
	},
);

bloggersRouter.put(
	'/:id',
	basicAuthorizationValidationMiddleware,
	...bloggersValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const isUpdated: boolean = await bloggersService.updateBlogger(
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
