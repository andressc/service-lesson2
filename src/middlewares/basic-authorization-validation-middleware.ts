import { Request, Response } from 'express';
import { NextFunction } from 'express';

export const basicAuthorizationValidationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const auth = req.header('authorization');

	if (!auth) {
		res.send(401);
		return;
	}

	const [name, base64] = auth.split(' ');

	if (name !== 'Basic') {
		res.send(401);
		return;
	}

	const [login, password] = Buffer.from(base64, 'base64').toString('ascii').split(':');

	if (login === 'admin' && password === 'qwerty') {
		next();
		return;
	}

	res.send(401);
	return;
};
