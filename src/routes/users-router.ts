import { Request, Response, Router } from 'express';
import { usersService } from '../domain/users-service';
import { PaginationTypeQuery } from '../types/paginationType';
import { basicAuthorizationValidationMiddleware } from '../middlewares/basic-authorization-validation-middleware';
import { usersValidationMiddleware } from '../middlewares/users-validation-middleware';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';

export const usersRouter = Router({});

usersRouter.get('/', async (req: Request<{}, {}, {}, PaginationTypeQuery>, res: Response) => {
	const blogs = await usersService.findAllUsers(req.query);
	res.send(blogs);
});

usersRouter.get('/:id', async (req: Request, res: Response) => {
	const user = await usersService.findUserById(req.params.id);

	if (user) {
		return res.send(user);
	}

	res.sendStatus(404);
});

usersRouter.delete(
	'/:id',
	basicAuthorizationValidationMiddleware,
	async (req: Request, res: Response) => {
		const isDeleted = await usersService.deleteUser(req.params.id);
		if (isDeleted) {
			return res.send(204);
		}

		return res.sendStatus(404);
	},
);

usersRouter.post(
	'/',
	basicAuthorizationValidationMiddleware,
	...usersValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const user = await usersService.createUser(req.body.login, req.body.password, req.body.email);
		return res.status(201).send(user);
	},
);
