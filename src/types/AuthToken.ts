import IUserBase from "./interfaces/IUserBase"

export type AccessToken = "accessToken"
export type RefreshToken = "refreshToken"

export type AuthTokenType = AccessToken | RefreshToken

export interface UserAuthTokens {
    accessToken: string
    refreshToken: string
}

export interface AuthTokenPayload extends IUserBase {
    tokenType: AuthTokenType
}