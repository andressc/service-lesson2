import {UsersType} from "./usersType";

declare global {
    declare namespace Express {
        export interface Request {
            user: null | UsersType
        }
    }
}
