import { Request, Response, Router } from 'express';
import { usersService } from '../domain/users-service';
import { jwtService } from '../application/jwt-service';
import { authValidationMiddleware } from '../middlewares/auth-validation-middleware';
import { errorValidationMiddleware } from '../middlewares/error-validation-middleware';

export const authRouter = Router({});

authRouter.post(
	'/',
	...authValidationMiddleware,
	errorValidationMiddleware,
	async (req: Request, res: Response) => {
		const user = await usersService.checkCredentials(req.body.login, req.body.password);
		if (user) {
			const token = await jwtService.createJWT(user);
			return res.status(200).send({ token });
		}
		return res.sendStatus(401);
	},
);

authRouter.post('/test', async (req: Request, res: Response) => {
	const test = await jwtService.verifyToken(req.body.token);

	console.log(test);
	if (test) {
		return res.send(test.toString());
	}
	return res.sendStatus(401);
});
