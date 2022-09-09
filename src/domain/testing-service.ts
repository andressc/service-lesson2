import { blogsRepository } from '../repositories/blogs-repository';
import { postsRepository } from '../repositories/posts-repository';
import { usersRepository } from '../repositories/users-repository';

export const testingService = {
	async deleteAllData(): Promise<boolean> {
		await blogsRepository.deleteAllBlogs();
		await postsRepository.deleteAllPosts();
		await usersRepository.deleteAllUsers();
		return true;
	},
};
