import { MongoClient } from 'mongodb';
import { BlogsType } from '../types/blogsType';
import { PostsType } from '../types/postsType';
import { UsersType } from '../types/usersType';
import { CommentsType } from '../types/commentsType';
import { config } from 'dotenv';

config();
const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:19017';

const client = new MongoClient(mongoUri);
const db = client.db('learning');

export const blogsCollection = db.collection<BlogsType>('blogs');
export const postsCollection = db.collection<PostsType>('posts');
export const usersCollection = db.collection<UsersType>('users');
export const usersCollection2 = db.collection<UsersType>('users2');
export const commentsCollection = db.collection<CommentsType>('comments');
export const bodyCollection = db.collection('body');

export const runDb = async () => {
	try {
		await client.connect();
		await db.command({ ping: 1 });
		console.log('connected successfully to mongo server');
	} catch (e) {
		console.log("Can't connect to db");
		await client.close();
	}
};
