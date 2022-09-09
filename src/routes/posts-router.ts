import { Request, Response, Router } from 'express';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';
import { postsValidationMiddleware } from '../middlewares/posts-validation-middleware';
import { basicAuthorizationValidationMiddleware } from '../middlewares/basic-authorization-validation-middleware';
import { postsService } from '../domain/posts-service';
import {PaginationType, PaginationTypeQuery} from '../types/paginationType';
import { blogsIdValidationMiddleware } from '../middlewares/blogs-id-validation-middleware';
import { bearerAuthorizationValidationMiddleware } from '../middlewares/bearer-authorization-validation-middleware';
import { commentsValidationMiddleware } from '../middlewares/comments-validation-middleware';
import {CommentsType} from "../types/commentsType";

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request<{}, {}, {}, PaginationTypeQuery>, res: Response) => {
	const posts = await postsService.findAllPosts(req.query);
	res.send(posts);
});

postsRouter.get(
	'/:id/comments',
	async (req: Request<{ id: string }, {}, {}, PaginationTypeQuery>, res: Response) => {
		const commentsOnPost: PaginationType<CommentsType[]> | boolean =
			await postsService.findAllCommentsOfPost(req.query, req.params.id);

		if (commentsOnPost) {
			return res.send(commentsOnPost);
		}

		return res.sendStatus(404);
	},
);

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
	...blogsIdValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const newPost = await postsService.createPost(req.body);

		if (newPost) {
			return res.status(201).send(newPost);
		}

		return res.sendStatus(404);
	},
);

postsRouter.post(
	'/:id/comments',
	bearerAuthorizationValidationMiddleware,
	...commentsValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const newComment = await postsService.createCommentPost(
			req.body.content,
			req!.user,
			req.params.id,
		);

		if (newComment) {
			return res.status(201).send(newComment);
		}

		return res.sendStatus(404);
	},
);

postsRouter.put(
	'/:id',
	basicAuthorizationValidationMiddleware,
	...postsValidationMiddleware,
	...blogsIdValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const isUpdated = await postsService.updatePost(req.params.id, req.body);

		if (isUpdated) {
			return res.sendStatus(204);
		}

		return res.sendStatus(404);
	},
);
