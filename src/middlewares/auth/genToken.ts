import jwt from "jsonwebtoken"
import { AuthTokenPayload, AuthTokenType } from "../../types/AuthToken.js"
import { logger } from "../../utils/logger.js"
import { IUserVerified } from "../../types/interfaces/IUserVerified.js"

const MODULE = "middlewares :: auth :: genToken"

/**
 * JWT auth token generator
 * @param user - User requesting the token
 * @param tokenType - Type of auth token to generate
 * @returns - Auth token as string
 */
export function generateAuthToken(user: IUserVerified, tokenType: AuthTokenType): string {
    let secretKey: string
    let expiresIn: string

    if (tokenType === "accessToken") {
        // accessToken
        secretKey = process.env.JWT_SECRET as string
        expiresIn = "1h"
    } else {
        // refreshToken
        secretKey = process.env.JWT_REFRESH_SECRET as string
        expiresIn = "365 days"
    }

    const payload: AuthTokenPayload = {
        email: user.email,
        tokenType,
    }

    logger(MODULE, `Auth token generated: email: ${payload.email}, tokenType: ${payload.tokenType}`)
    return jwt.sign(payload, secretKey, { expiresIn })
}
