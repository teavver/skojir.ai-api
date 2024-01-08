import { IUserBase } from "./interfaces/IUserBase"

export const SUPPORTED_TOKENS = ["accessToken", "refreshToken"]
export type AuthTokenType = typeof SUPPORTED_TOKENS[number]

export interface UserAuthTokens {
    accessToken: string
    refreshToken: string
}

export interface AuthTokenPayload extends IUserBase {
    tokenType: AuthTokenType
}