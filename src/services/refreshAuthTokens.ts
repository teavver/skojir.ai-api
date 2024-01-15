import { Request } from "express"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import { logger } from "../utils/logger.js"
import { generateAuthToken } from "../middlewares/auth/genToken.js"
import { IUserVerified } from "../types/interfaces/IUserVerified.js"
import { UserAuthTokens } from "../types/AuthToken.js"

const MODULE = "services :: refreshAuthTokens"

export async function refreshAuthTokens(req:Request): Promise<ServiceResponse<UserAuthTokens>> {

    const userData: IUserVerified = req.user!
    logger(MODULE, `Refresh token request for user: ${userData.email}`)

    // Generate new tokens
    const newRefreshToken: UserAuthTokens["refreshToken"] = generateAuthToken(userData, "refreshToken")
    const newAccessToken: UserAuthTokens["accessToken"] = generateAuthToken(userData, "accessToken")
    let newMembershipToken: UserAuthTokens["membershipToken"] = ""
    if (userData.membershipDetails && userData.membershipDetails.isActive === true) {
        newMembershipToken = generateAuthToken(userData, "membershipToken")
    }

    const newUserTokens: UserAuthTokens = {
        refreshToken: newRefreshToken,
        accessToken: newAccessToken,
        membershipToken: newMembershipToken,
    }

    return {
        err: false,
        data: newUserTokens,
        statusCode: 200
    }

}