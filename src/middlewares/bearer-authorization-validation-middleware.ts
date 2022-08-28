import { Request, Response } from 'express';
import { NextFunction } from 'express';
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const bearerAuthorizationValidationMiddleware = async(
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const auth = req.header('authorization');

	if (!auth) {
		return res.sendStatus(401);
	}

	const [name, token] = auth.split(' ');

	if (name !== 'Bearer') {
		return res.sendStatus(401);
	}

	const authUserId = await jwtService.getUserAuthByToken(token);

	if (authUserId) {
		req.user = await usersService.findUserById(authUserId.userId)
		return next()
	}

	return res.sendStatus(401);
};
