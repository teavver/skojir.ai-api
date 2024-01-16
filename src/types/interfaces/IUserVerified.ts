import { IUserCredentials } from "./IUserCredentials.js"
import { IMembership } from "./IMembership.js"
import { IDeviceID } from "./IDeviceID.js"
import { UserAuthTokens } from "../AuthToken.js"

export interface IUserVerified extends IUserCredentials {
    salt: string
    isEmailVerified: true
    membershipDetails?: IMembership

    refreshTokens: Array<UserRefreshToken>

    // ↓ Only while changing account's email
    verificationCode?: string
    verificationCodeExpires?: Date
}

export interface UserRefreshToken {
    deviceId: IDeviceID
    token: UserAuthTokens["refreshToken"]
}
