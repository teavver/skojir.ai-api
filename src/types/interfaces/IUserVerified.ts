import { IUserCredentials } from "./IUserCredentials.js";
import { IMembership } from "./IMembership.js";
import { UserAuthTokens } from "../AuthToken.js";

export interface IUserVerified extends IUserCredentials {
    salt: string
    isEmailVerified: true
    membershipDetails?: IMembership
    refreshToken: UserAuthTokens["refreshToken"]

    // ↓ Only while changing account's email
    verificationCode?: string
    verificationCodeExpires?: Date
}