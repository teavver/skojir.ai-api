import { IUserCredentials } from "./IUserCredentials.js"
import { IMembership } from "./IMembership.js"
import { IDeviceID } from "./IDeviceID.js"
import { UserAuthTokens } from "../AuthToken.js"

export interface IUserVerified extends IUserCredentials {
    salt: string
    isEmailVerified: true
    membershipDetails?: IMembership

    refreshTokens: Array<UserRefreshToken>

    // ↓ Only if changing account's email
    emailOTP?: string
    emailOTPExpires?: Date

    // ↓ Only if changing password
    pwdChangeOTP?: string
    pwdChangeOTPExpires?: Date
}

export interface UserRefreshToken {
    deviceId: IDeviceID
    token: UserAuthTokens["refreshToken"]
}
