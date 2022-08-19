import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {errorValidationMiddleware} from "../middlewares/error-validation-middleware";
import {bloggersValidationMiddleware} from "../middlewares/bloggers-validation-middleware";
import {BloggersType} from "../types/bloggersType";
import {authorizationValidationMiddleware} from "../middlewares/authorization-validation-middleware";

export const bloggersRouter = Router({});

bloggersRouter.get('/',
    async (req: Request, res: Response) => {
    const bloggers: BloggersType[] = await bloggersRepository.findAllBloggers()
    res.send(bloggers);
});

bloggersRouter.get('/:id', async (req: Request, res: Response) => {

   const blogger: BloggersType | null = await bloggersRepository.findBloggerById(+req.params.id);

   if(blogger) {
       res.send(blogger);
       return;
   }

    res.send(404);
});

/*bloggersRouter.delete('/', (req: Request, res: Response) => {
    res.send(404);
});*/

bloggersRouter.delete('/:id',
    authorizationValidationMiddleware,
    async (req: Request, res: Response) => {
    const isDeleted: boolean = await bloggersRepository.deleteBlogger(+req.params.id)
    if(isDeleted) {
        res.send(204);
        return;
    }

    res.send(404);
});

bloggersRouter.post('/',
    authorizationValidationMiddleware,
    ...bloggersValidationMiddleware,
    errorValidationMiddleware,
    async (req: Request, res: Response) => {
    const newBloggerId: number = await bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl);
    const testNewBlogger: BloggersType | null = await bloggersRepository.findBloggerById(newBloggerId);
    if(testNewBlogger) {
        res.status(201).send(testNewBlogger);
        return;
    }

    res.send(400);
});

/*bloggersRouter.put('/', (req: Request, res: Response) => {
        res.send(404);
})*/

bloggersRouter.put('/:id',
    authorizationValidationMiddleware,
    ...bloggersValidationMiddleware,
    errorValidationMiddleware,
    async (req: Request, res: Response) => {
    const isUpdated: boolean = await bloggersRepository.updateBlogger(+req.params.id, req.body.name, req.body.youtubeUrl);
    if(isUpdated) {
        res.send(204);
        return;
    }

    res.send(404);
});