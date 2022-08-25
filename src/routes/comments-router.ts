import { Request, Response, Router } from 'express';
import { CommentsType } from '../types/commentsType';
import { commentsService } from '../domain/comments-service';

export const commentsRouter = Router({});

commentsRouter.get('/:id', async (req: Request, res: Response) => {
	const comment: CommentsType | null = await commentsService.findCommentById(req.params.id);

	if (comment) {
		return res.send(comment);
	}

	res.sendStatus(404);
});
