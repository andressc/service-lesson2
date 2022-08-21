import {postsRepository} from "../repositories/bloggers-repository-db";
import {BloggersType} from "../types/bloggersType";

export const bloggersService = {
    async findAllBloggers(): Promise<BloggersType[]> {
        return postsRepository.findAllBloggers();
    },

    async findBloggerById(id: number): Promise<BloggersType | null>  {
        return postsRepository.findBloggerById(id);
    },

    async deleteBlogger(id: number): Promise<boolean> {
        return await postsRepository.deleteBlogger(id)
    },

    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await postsRepository.updateBlogger(id, name, youtubeUrl)
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<number> {
        const newBlogger = {id: +(new Date()), name, youtubeUrl};

        return await postsRepository.createBlogger(newBlogger);
    }
}