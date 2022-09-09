import { body } from 'express-validator';
import { blogsService } from '../domain/blogs-service';

export const blogsIdValidationMiddleware = [
	body('blogId')
		.notEmpty()
		.withMessage('must not be empty')
		.custom(async (value) => {
			const blog = await blogsService.findBlogById(value);
			if (!blog) {
				throw new Error('Blog with that ID is not exists!');
			}
			return true;
		}),
];
