import { Request, Response, Router } from 'express';
import { usersService } from '../domain/users-service';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { UsersType } from '../types/usersType';
import { basicAuthorizationValidationMiddleware } from '../middlewares/basic-authorization-validation-middleware';
import { usersValidationMiddleware } from '../middlewares/users-validation-middleware';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';

export const usersRouter = Router({});

usersRouter.get('/', async (req: Request<{}, {}, {}, PaginationTypeQuery>, res: Response) => {
	const bloggers: PaginationType<UsersType[]> = await usersService.findAllUsers(req.query);
	res.send(bloggers);
});

usersRouter.delete(
	'/:id',
	basicAuthorizationValidationMiddleware,
	async (req: Request, res: Response) => {
		const isDeleted: boolean = await usersService.deleteUser(req.params.id);
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
		const user = await usersService.createUser(req.body.login, req.body.password);
		res.send(user);
	},
);
