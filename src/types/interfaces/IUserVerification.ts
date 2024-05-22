import { IUserBase } from "./IUserBase"

// NOTE: 'email' is optional because all IUserVerification endpoints have JWT-middleware
// And the middleware will populare req.user for services if the AccessToken is valid
// ('email' is still required in the /email-change endpoint though)
export interface IUserVerification extends Partial<IUserBase> {
    otp: string
    resend?: true
}

export interface IUserPwdChange extends IUserVerification {
    newPwd: string
}
