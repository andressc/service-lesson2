import express from 'express';
import bodyParser from 'body-parser';
import { bloggersRouter } from './routes/bloggers-router';
import { postsRouter } from './routes/posts-router';
import { runDb } from './db/db';
import { config } from 'dotenv';

config();
const app = express();
console.log(app.prototype);

const port = process.env.PORT || 3000;

const parserMiddleware = bodyParser({});
app.use(parserMiddleware);
app.use('/bloggers', bloggersRouter);
app.use('/posts', postsRouter);

const startApp = async () => {
	await runDb();
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`);
	});
};

startApp();
