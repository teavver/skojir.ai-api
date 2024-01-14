import { IUserVerified } from "../types/interfaces/IUserVerified";
import { UserRefreshToken } from "../types/interfaces/IUserVerified";
import { IDeviceID } from "../types/interfaces/IDeviceID";

export function isNewDeviceId(user: IUserVerified, uuid: IDeviceID): boolean {
    return user.refreshTokens.some((token: UserRefreshToken)  => token.deviceId === uuid)
}