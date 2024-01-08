import { IUserVerified } from "../express/interfaces/IUserVerified.js"

export interface AccessTokenRefreshRequest {
    refreshToken: string
    user?: IUserVerified
}