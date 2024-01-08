import { IUserVerified } from "./interfaces/IUserVerified";

export {}

declare global {
    namespace Express {
        export interface Request {
            user?: IUserVerified
        }
    }
}