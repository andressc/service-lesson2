import {Request, Response} from "express";
import {NextFunction} from "express";
import {validationResult} from "express-validator";

export const errorValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArr = errors.array().map(v => { return {message: v.msg, field: v.param}})

        res.status(400).json({ errorsMessages: errorArr });
    } else {
        next();
    }
}