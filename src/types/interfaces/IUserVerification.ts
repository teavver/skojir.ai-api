import { IUserBase } from "./IUserBase.js";

export interface IUserVerification extends IUserBase {
    verificationCode: string
    resend?: boolean
}