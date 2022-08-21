import { BloggersType } from '../types/bloggersType';

const bloggers: BloggersType[] = [
	{
		id: 1,
		name: 'IT-INCUBATOR',
		youtubeUrl: 'https://www.youtube.com/c/ITINCUBATOR',
	},
	{
		id: 2,
		name: 'IT-KAMASUTRA',
		youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA',
	},
	{
		id: 3,
		name: 'Blogger',
		youtubeUrl: 'https://www.youtube.com/c/ergegerger',
	},
];

export const bloggersRepository = {
	async findAllBloggers(): Promise<BloggersType[]> {
		return bloggers;
	},

	async findBloggerById(id: number): Promise<BloggersType | null> {
		const [blogger] = bloggers.filter((v) => v.id === id);

		if (blogger) {
			return blogger;
		}

		return null;
	},

	async isBloggerById(id: number): Promise<BloggersType | false> {
		const blogger = bloggers.find((v) => v.id === id);
		if (blogger) {
			return blogger;
		}

		return false;
	},

	async deleteBlogger(id: number): Promise<boolean> {
		for (let i = 0; i < bloggers.length; i++) {
			if (bloggers[i].id === id) {
				bloggers.splice(i, 1);
				return true;
			}
		}

		return false;
	},

	async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
		const blogger = bloggers.find((v) => v.id === id);
		if (blogger) {
			blogger.name = name;
			blogger.youtubeUrl = youtubeUrl;
			return true;
		}

		return false;
	},

	async createBlogger(name: string, youtubeUrl: string): Promise<number> {
		const newBlogger = {
			id: +new Date(),
			name,
			youtubeUrl,
		};
		bloggers.push(newBlogger);
		return newBlogger.id;
	},
};
