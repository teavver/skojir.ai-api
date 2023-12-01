import { Request } from "express"
import { IUserVerified } from "../../interfaces/IUserVerified.js"

/**
 * Request for client to refresh their access JWT
 */
export interface AccessTokenRefreshRequest extends Request {
    refreshToken: string
    user?: IUserVerified // auth will populate this on success
}