import { Request, Response, Router } from 'express';
import { testingService } from '../domain/testing-service';

export const testingRouter = Router({});

testingRouter.delete(
	'/all-data',
	//basicAuthorizationValidationMiddleware,
	async (req: Request, res: Response) => {
		await testingService.deleteAllData();
		return res.send(204);
	},
);
