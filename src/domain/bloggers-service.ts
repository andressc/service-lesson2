import {bloggersRepository} from "../repositories/bloggers-repository-db";
import {BloggersType} from "../types/bloggersType";

export const bloggersService = {
    async findAllBloggers(): Promise<BloggersType[]> {
        return bloggersRepository.findAllBloggers();
    },

    async findBloggerById(id: number): Promise<BloggersType | null>  {
        return bloggersRepository.findBloggerById(id);
    },

    async deleteBlogger(id: number): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    },

    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<number> {
        const newBlogger = {id: +(new Date()), name, youtubeUrl};

        return await bloggersRepository.createBlogger(newBlogger);
    }
}