import { IUserBase } from "./interfaces/IUserBase"

export const SUPPORTED_TOKENS = ["accessToken", "refreshToken", "membershipToken"] as const
export type AuthTokenType = (typeof SUPPORTED_TOKENS)[number]

export type UserAuthTokens = {
    [key in AuthTokenType]: string
}

export interface AuthTokenPayload extends IUserBase {
    tokenType: AuthTokenType
}

export interface RequestTokenData {
    type: AuthTokenType
    value: string
}

export interface UserTokens {
    accessToken: UserAuthTokens["accessToken"]
    membershipToken?: UserAuthTokens["membershipToken"]
}
