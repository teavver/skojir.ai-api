import { IUserCredentials } from "./IUserCredentials.js"

export interface IUserUnverified extends IUserCredentials {
    salt: string
    isEmailVerified: false
    emailOTP: string
    emailOTPExpires: Date
}
