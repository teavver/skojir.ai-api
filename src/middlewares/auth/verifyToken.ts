import jwt from "jsonwebtoken"
import { NextFunction } from "express"
import { AccessTokenRefreshRequest } from "../../types/requests/client/AccessTokenRefreshRequest.js"
import { ResponseMessage } from "../../types/responses/ResponseMessage.js"
import { AuthTokenPayload } from "../../types/AuthToken.js"
import { User } from "../../models/User.js"
import { IUserVerified } from "../../types/interfaces/IUserVerified.js"
import { logger, LogType } from "../../utils/logger.js"
import { createResponseAndLog } from "../../utils/createResponseAndLog.js"

const MODULE = "middlewares :: auth :: verifyToken"

/**
 * Authenticate user's access token based on included refreshToken in the request
 */
export async function verifyToken(req: AccessTokenRefreshRequest, next: NextFunction): Promise<void | ResponseMessage> {

    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return createResponseAndLog("unauthorized", MODULE, "No token was provided.", LogType.ERR)
    }

    try {

        const authPayload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthTokenPayload

        const user = await User.findOne({ email: authPayload.email })
        if (!user) {
            return createResponseAndLog("unauthorized", MODULE, "User does not match token payload.", LogType.ERR)
        }

        if (!user.isEmailVerified) {
            return createResponseAndLog("unauthorized", MODULE, "User account is not verified.", LogType.ERR)
        }

        req.user = user as IUserVerified
        next()

    } catch (error) {

        if (error instanceof jwt.JsonWebTokenError) {
            return createResponseAndLog("unauthorized", MODULE, "Invalid token.", LogType.ERR)
        }
        return createResponseAndLog("unauthorized", MODULE, "Failed to authenticate token", LogType.ERR)
    }
}