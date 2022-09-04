import { bloggersRepository } from '../repositories/bloggers-repository';
import { postsRepository } from '../repositories/posts-repository';
import { usersRepository } from '../repositories/users-repository';

export const testingService = {
	async deleteAllData(): Promise<boolean> {
		await bloggersRepository.deleteAllBloggers();
		await postsRepository.deleteAllPosts();
		await usersRepository.deleteAllUsers();
		return true;
	},
};
