import { Request, Response, Router } from 'express';
import { bloggersService } from '../domain/bloggers-service';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';
import { bloggersValidationMiddleware } from '../middlewares/bloggers-validation-middleware';
import { BloggersType } from '../types/bloggersType';
import { authorizationValidationMiddleware } from '../middlewares/authorization-validation-middleware';
import { PostsType } from '../types/postsType';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import {postsValidationMiddleware} from "../middlewares/posts-validation-middleware";

export const bloggersRouter = Router({});

bloggersRouter.get('/', async (req: Request<{}, {}, {}, PaginationTypeQuery>, res: Response) => {
	const bloggers: PaginationType<BloggersType[]> = await bloggersService.findAllBloggers(req.query);
	res.send(bloggers);
});

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
	const blogger: BloggersType | null = await bloggersService.findBloggerById(+req.params.id);

	if (blogger) {
		res.send(blogger);
		return;
	}

	res.send(404);
});

bloggersRouter.get(
	'/:id/posts',
	async (req: Request<{ id: number }, {}, {}, PaginationTypeQuery>, res: Response) => {
		const bloggerPosts: PaginationType<PostsType[]> = await bloggersService.findAllPostsBlogger(
			req.query,
			+req.params.id,
		);

		if(bloggerPosts.totalCount > 0) {
			return res.send(bloggerPosts);
		}

		return res.send(404);
	},
);

bloggersRouter.delete(
	'/:id',
	authorizationValidationMiddleware,
	async (req: Request, res: Response) => {
		const isDeleted: boolean = await bloggersService.deleteBlogger(+req.params.id);
		if (isDeleted) {
			res.send(204);
			return;
		}

		res.send(404);
	},
);

bloggersRouter.post(
	'/',
	authorizationValidationMiddleware,
	...bloggersValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const newBloggerId: number = await bloggersService.createBlogger(
			req.body.name,
			req.body.youtubeUrl,
		);
		const testNewBlogger: BloggersType | null = await bloggersService.findBloggerById(newBloggerId);
		if (testNewBlogger) {
			res.status(201).send(testNewBlogger);
			return;
		}

		res.send(404);
	},
);

bloggersRouter.post(
	'/:id/posts',
	authorizationValidationMiddleware,
	...postsValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const bloggersPost: PostsType | null = await bloggersService.createBloggerPost(
			+req.params.id,
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
	authorizationValidationMiddleware,
	...bloggersValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const isUpdated: boolean = await bloggersService.updateBlogger(
			+req.params.id,
			req.body.name,
			req.body.youtubeUrl,
		);
		if (isUpdated) {
			res.send(204);
			return;
		}

		res.send(404);
	},
);
