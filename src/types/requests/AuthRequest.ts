import { IUserVerified } from "../interfaces/IUserVerified";

/**
 * Request type for endpoints protected with JWT middleware
 */
export interface AuthRequest {
    user?: IUserVerified
}