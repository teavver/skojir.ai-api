import { IUserBase } from "./IUserBase"

export interface IUserVerification extends Partial<IUserBase> {
    verificationCode: string
    resend?: boolean
}
