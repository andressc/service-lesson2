import {MongoClient} from "mongodb";
import {BloggersType} from "../types/bloggersType";
import {PostsType} from "../types/postsType";


const mongoUri = process.env.mongoURI || "mongodb+srv://admin:674511aaqq@cluster0.ry8zvtg.mongodb.net/?retryWrites=true&w=majority";

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