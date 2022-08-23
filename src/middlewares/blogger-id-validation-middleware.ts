import { body } from 'express-validator';
import { bloggersService } from '../domain/bloggers-service';

export const bloggerIdValidationMiddleware = [
	body('bloggerId')
		.isNumeric()
		.withMessage('field must be a number')
		.notEmpty()
		.withMessage('must not be empty')
		.custom(async (value, { req }) => {
			const blogger = await bloggersService.findBloggerById(value);
			if (!blogger) {
				throw new Error('Blogger with that ID is not exists!');
			}
			return true;
		})
];
