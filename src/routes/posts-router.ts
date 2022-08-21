import { Request, Response, Router } from 'express';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';
import { postsValidationMiddleware } from '../middlewares/posts-validation-middleware';
import { PostsType } from '../types/postsType';
import { authorizationValidationMiddleware } from '../middlewares/authorization-validation-middleware';
import { postsService } from '../domain/posts-service';

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {
	const posts: PostsType[] = await postsService.findAllPosts();
	res.send(posts);
});

postsRouter.get('/:id', async (req: Request, res: Response) => {
	const post: PostsType | null = await postsService.findPostById(+req.params.id);

	if (post) {
		res.send(post);
		return;
	}

	res.send(404);
});

/*postsRouter.delete('/',
    (req: Request, res: Response) => {
    res.send(404);
});*/

postsRouter.delete(
	'/:id',
	authorizationValidationMiddleware,
	async (req: Request, res: Response) => {
		const isDeleted: boolean = await postsService.deletePost(+req.params.id);

		if (isDeleted) {
			res.send(204);
			return;
		}

		res.send(404);
	},
);

postsRouter.post(
	'/',
	authorizationValidationMiddleware,
	...postsValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const newPostId: number = await postsService.createPost(
			req.body.title,
			req.body.shortDescription,
			req.body.content,
			req.body.bloggerId,
			req.body.bloggerName,
		);

		if (!newPostId) {
			res.send(400);
			return;
		}
		const testNewPost: PostsType | null = await postsService.findPostById(newPostId);
		if (testNewPost) {
			res.status(201).send(testNewPost);
			return;
		}

		res.send(400);
	},
);

postsRouter.put(
	'/:id',
	authorizationValidationMiddleware,
	...postsValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const isUpdated: boolean = await postsService.updatePost(
			+req.params.id,
			req.body.title,
			req.body.shortDescription,
			req.body.content,
			req.body.bloggerId,
			req.body.bloggerName,
		);

		if (isUpdated) {
			res.send(204);
			return;
		}

		res.send(404);
	},
);
