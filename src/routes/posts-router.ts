import { Request, Response, Router } from 'express';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';
import { postsValidationMiddleware } from '../middlewares/posts-validation-middleware';
import { basicAuthorizationValidationMiddleware } from '../middlewares/basic-authorization-validation-middleware';
import { postsService } from '../domain/posts-service';
import { PaginationTypeQuery } from '../types/paginationType';
import { bloggerIdValidationMiddleware } from '../middlewares/blogger-id-validation-middleware';

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request<{}, {}, {}, PaginationTypeQuery>, res: Response) => {
	const posts = await postsService.findAllPosts(req.query);
	res.send(posts);
});

postsRouter.get('/:id', async (req: Request, res: Response) => {
	const post = await postsService.findPostById(req.params.id);

	if (post) {
		return res.send(post);
	}

	res.sendStatus(404);
});

postsRouter.delete(
	'/:id',
	basicAuthorizationValidationMiddleware,
	async (req: Request, res: Response) => {
		const isDeleted = await postsService.deletePost(req.params.id);

		if (isDeleted) {
			return res.sendStatus(204);
		}

		return res.sendStatus(404);
	},
);

postsRouter.post(
	'/',
	basicAuthorizationValidationMiddleware,
	...postsValidationMiddleware,
	...bloggerIdValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const newPost = await postsService.createPost(req.body);

		if (newPost) {
			return res.status(201).send(newPost);
		}

		return res.sendStatus(404);
	},
);

postsRouter.put(
	'/:id',
	basicAuthorizationValidationMiddleware,
	...postsValidationMiddleware,
	...bloggerIdValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const isUpdated = await postsService.updatePost(req.params.id, req.body);

		if (isUpdated) {
			return res.sendStatus(204);
		}

		return res.sendStatus(404);
	},
);
