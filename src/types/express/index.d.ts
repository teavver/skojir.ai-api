import { IUserVerified } from "../interfaces/IUserVerified";
import { RequestTokenData } from "../AuthToken";

export {}

declare global {
    namespace Express {
        export interface Request {
            user?: IUserVerified
            tokenData?: RequestTokenData
        }
    }
}