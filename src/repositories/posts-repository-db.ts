import {PostsType} from "../types/postsType";
import {postsCollection} from "./db";

export const postsRepository = {
    async findAllPosts(): Promise<PostsType[]> {
        return postsCollection.find({}).toArray()
    },

    async findPostById(id: number): Promise<PostsType[]> {
        return postsCollection.find({id}).toArray()
    },

    async deletePost(id: number): Promise<boolean> {

        const result = await postsCollection.deleteOne({id})

        if(result.deletedCount > 0) {
            return true;
        }

        return false;
    },

    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<boolean> {
        const result = await postsCollection.updateOne({id}, { $set: {
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName
        }})

        if(result.matchedCount === 1) {
            return true;
        }

        return false;
    },

    async createPost(title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<number> {

        const newPost = {
            id: +(new Date()),
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName
        };

        await postsCollection.insertOne(newPost);

        return newPost.id;
    }
}