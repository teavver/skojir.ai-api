import { IUserCredentials } from "./IUserCredentials.js";
import { IMembership } from "./IMembership.js";

export interface IUserVerified extends IUserCredentials {
    salt: string
    isEmailVerified: true
    membershipDetails?: IMembership
    accessToken?: string
    refreshToken?: string

    // ↓ Only while changing account's email
    verificationCode?: string
    verificationCodeExpires?: Date
}