export interface RepositoryInterface<Type> {
	createBlog: <T>(newBlog: keyof T) => Promise<Type>;
	deleteBlog: (id: string) => Promise<boolean>;
	updateBlog: (id: string, name: string, youtubeUrl: string) => Promise<boolean>;
}
