import IUserCredentials from "./IUserCredentials.js";

export default interface IUserUnverified extends IUserCredentials {
    salt: string
    isEmailVerified: false
    verificationCode: string
    verificationCodeExpires: Date
}