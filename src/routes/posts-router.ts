import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {errorValidationMiddleware} from "../middlewares/error-validation-middleware";
import {isBloggerMiddleware} from "../middlewares/is-bloger-middleware";
import {postsValidationMiddleware} from "../middlewares/posts-validation-middleware";
import {PostsType} from "../types/postsType";
import {authorizationValidationMiddleware} from "../middlewares/authorization-validation-middleware";

export const postsRouter = Router({});

postsRouter.get('/',
    async (req: Request, res: Response) => {
    const posts: PostsType[] = await postsRepository.findAllPosts()
    res.send(posts);
});

postsRouter.get('/:id',
    async (req: Request, res: Response) => {

    const [blogger]: PostsType[] = await postsRepository.findPostById(+req.params.id);

    if(blogger) {
        res.send(blogger);
        return;
    }

    res.send(404);
});

/*postsRouter.delete('/',
    (req: Request, res: Response) => {
    res.send(404);
});*/

postsRouter.delete('/:id',
    authorizationValidationMiddleware,
    async (req: Request, res: Response) => {
    const isDeleted: boolean = await postsRepository.deletePost(+req.params.id)

    if(isDeleted) {
        res.send(204);
        return;
    }

    res.send(404);
});

postsRouter.post('/',
    authorizationValidationMiddleware,
    ...postsValidationMiddleware,
    errorValidationMiddleware,
    isBloggerMiddleware,
    async (req: Request, res: Response) => {

    const newPostId: number = await postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId, req.body.bloggerName);

    if(!newPostId) {
        res.send(400);
        return
    }
    const [testNewPost]:PostsType[] = await postsRepository.findPostById(newPostId);
    if(testNewPost) {
        res.status(201).send(testNewPost);
        return;
    }

    res.send(400);
});

postsRouter.put('/:id',
    authorizationValidationMiddleware,
    ...postsValidationMiddleware,
    errorValidationMiddleware,
    isBloggerMiddleware,
    async (req: Request, res: Response) => {

    const isUpdated: boolean = await postsRepository.updatePost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId, req.body.bloggerName);

    if(isUpdated) {
        res.send(204);
        return;
    }

    res.send(404);
});
