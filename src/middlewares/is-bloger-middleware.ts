import {Request, Response} from "express";
import {NextFunction} from "express";
import {BloggersType} from "../types/bloggersType";
import {bloggersService} from "../domain/bloggers-service";

export const isBloggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const isBlogger: BloggersType | null = await bloggersService.findBloggerById(req.body.bloggerId)

    if (!isBlogger) {
        return res.status(400).json({ errorsMessages: [{ message: "blogger with this id does not exist", field: "bloggerId" }] });
    } else {
        req.body.bloggerId = isBlogger.id;
        req.body.bloggerName = isBlogger.name;
        return next();
    }
}