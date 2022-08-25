import { bloggersRepository } from '../repositories/bloggers-repository';
import { postsRepository } from '../repositories/posts-repository';

export const testingService = {
	async deleteAllData(): Promise<boolean> {
		await bloggersRepository.deleteAllBloggers();
		await postsRepository.deleteAllPosts();
		return true;
	},
};
