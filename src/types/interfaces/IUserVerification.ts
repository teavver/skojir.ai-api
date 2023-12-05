import IUserBase from "./IUserBase.js";

export default interface IUserVerification extends IUserBase {
    verificationCode: string
    resend?: boolean
}