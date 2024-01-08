import { IUserCredentials } from "./IUserCredentials.js";

export interface IUserUnverified extends IUserCredentials {
    salt: string
    isEmailVerified: false
    verificationCode: string
    verificationCodeExpires: Date
}