import {MongoClient} from "mongodb";
import {BloggersType} from "../types/bloggersType";
import {PostsType} from "../types/postsType";


const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

const client = new MongoClient(mongoUri);
const db = client.db("learning")
export const bloggersCollection = db.collection<BloggersType>("bloggers");
export const postsCollection = db.collection<PostsType>("posts");

export const runDb = async () => {
    try {
        await client.connect();
        await db.command({ping: 1})
        console.log("connected successfully to mongo server")
    } catch (e) {
        console.log("Can't connect to db")
        await client.close();
    }
}