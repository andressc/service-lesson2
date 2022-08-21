import express from 'express';
import bodyParser from 'body-parser';
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./db/db";

const app = express();
const port = process.env.PORT || 3000;

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

startApp()