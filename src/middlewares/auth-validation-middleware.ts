import { body } from 'express-validator';

export const authValidationMiddleware = [
	body('login')
		.trim()
		.notEmpty()
		.withMessage('must not be empty')
		.isString()
		.withMessage('must to be string'),

	body('password')
		.trim()
		.notEmpty()
		.withMessage('must not be empty')
		.isString()
		.withMessage('must to be string'),
];
