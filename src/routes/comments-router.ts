import { Request, Response, Router } from 'express';
import { commentsService } from '../domain/comments-service';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';
import { commentsValidationMiddleware } from '../middlewares/comments-validation-middleware';
import { bearerAuthorizationValidationMiddleware } from '../middlewares/bearer-authorization-validation-middleware';
import { CommentsType } from '../types/commentsType';
import { HttpStatusCode } from '../types/StatusCode';

export const commentsRouter = Router({});

commentsRouter.get('/:id', async (req: Request, res: Response) => {
	const comment = await commentsService.findCommentById(req.params.id);

	if (comment) {
		return res.send(comment);
	}

	res.sendStatus(404);
});

commentsRouter.put(
	'/:id',
	bearerAuthorizationValidationMiddleware,
	...commentsValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request<{ id: string }, {}, CommentsType, {}>, res: Response) => {
		const isUpdated = await commentsService.updateComment(req.params.id, req.body, req!.user);

		if (isUpdated === HttpStatusCode.FORBIDDEN) {
			return res.sendStatus(HttpStatusCode.FORBIDDEN);
		}

		if (isUpdated) {
			return res.sendStatus(204);
		}

		return res.sendStatus(404);
	},
);

commentsRouter.delete(
	'/:id',
	bearerAuthorizationValidationMiddleware,
	async (req: Request, res: Response) => {
		const isDeleted = await commentsService.deleteComment(req.params.id, req!.user);

		if (isDeleted === HttpStatusCode.FORBIDDEN) {
			return res.sendStatus(HttpStatusCode.FORBIDDEN);
		}

		if (isDeleted) {
			return res.sendStatus(204);
		}

		return res.sendStatus(404);
	},
);
