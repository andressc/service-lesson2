import {bloggersCollection} from "./db";
import {BloggersType} from "../types/bloggersType";

export const bloggersRepository = {
    async findAllBloggers(): Promise<BloggersType[]> {
        return bloggersCollection.find({}).toArray();
    },

    async findBloggerById(id: number): Promise<BloggersType | null>  {
        const blogger: BloggersType | null  = await bloggersCollection.findOne({id})

        if(blogger) {
            return blogger
        }

        return null
    },

    async deleteBlogger(id: number): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id})

        if(result.deletedCount === 1) {
            return true;
        }

        return false;
    },

    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id}, { $set: {name, youtubeUrl}})

        if(result.matchedCount === 1) {
            return true;
        }

        return false;
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<number> {
        const newBlogger = {id: +(new Date()), name, youtubeUrl};

        await bloggersCollection.insertOne(newBlogger);

        return newBlogger.id;
    }
}