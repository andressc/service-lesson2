import {PostsType} from "../types/postsType";

const posts: PostsType[] = [
    {
        id: 0,
        title: 'hello',
        shortDescription: 'Short',
        content: 'Long description post',
        bloggerId: 1,
        bloggerName: 'IT-INCUBATOR'
    }
];

export const postsRepository = {
    async findAllPosts(): Promise<PostsType[]> {
        return posts;
    },

    async findPostById(id: number): Promise<PostsType[]> {
        return posts.filter(v => v.id === id);
    },

    async deletePost(id: number): Promise<boolean> {
        for(let i=0; i< posts.length; i++) {
            if(posts[i].id === id) {
                posts.splice(i, 1);
                return true;
            }
        }

        return false;
    },

    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<boolean> {
        const post = posts.find(v => v.id === id);
        if(post) {
            post.title = title;
            post.shortDescription = shortDescription;
            post.content = content;
            post.bloggerId = bloggerId;
            post.bloggerName = bloggerName;
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

        posts.push(newPost);
        return newPost.id;
    }
}