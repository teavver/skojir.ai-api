import { IUserVerified } from "../interfaces/IUserVerified.js"

export interface AccessTokenRefreshRequest {
    refreshToken: string
    user?: IUserVerified
}
