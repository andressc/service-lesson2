import {PostsType} from "../types/postsType";
import {postsCollection} from "../db/db";

export const postsRepository = {
    async findAllPosts(): Promise<PostsType[]> {
        return postsCollection.find({}).toArray()
    },

    async findPostById(id: number): Promise<PostsType | null> {
        const post: PostsType | null  = await postsCollection.findOne({id})

        if(post) {
            return post
        }

        return null
    },

    async deletePost(id: number): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1;
    },

    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<boolean> {
        const result = await postsCollection.updateOne({id}, { $set: {
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName
        }})

        return result.matchedCount === 1;
    },

    async createPost(newPost: PostsType): Promise<number> {
        await postsCollection.insertOne(newPost);
        return newPost.id;
    }
}