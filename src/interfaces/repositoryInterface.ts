export interface RepositoryInterface<Type> {
	createBlogger: <T>(newBlogger: keyof T) => Promise<Type>;
	deleteBlogger: (id: string) => Promise<boolean>;
	updateBlogger: (id: string, name: string, youtubeUrl: string) => Promise<boolean>;
}
