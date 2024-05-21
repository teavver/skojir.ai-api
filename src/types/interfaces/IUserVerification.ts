import { IUserBase } from "./IUserBase"

export interface IUserVerification extends Partial<IUserBase> {
    otp: string
    resend?: boolean
}
