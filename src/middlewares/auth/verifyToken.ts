import jwt, { JwtPayload } from "jsonwebtoken"
import { Response, NextFunction, Request } from "express"
import { AuthTokenPayload } from "../../types/AuthToken.js"
import { User } from "../../models/User.js"
import { IUserVerified } from "../../types/interfaces/IUserVerified.js"
import { logger, LogType } from "../../utils/logger.js"
import { ResponseMessage } from "../../types/responses/ResponseMessage.js"
import { isUserVerified } from "../../utils/isUserVerified.js"
import { AuthTokenType } from "../../types/AuthToken.js"

const MODULE = "middlewares :: auth :: verifyToken"

/**
 * Authenticate Bearer token in a request
 * 
 * @param expectedTokenType - Required token type. Defaults to `accessToken`
 */
export const verifyToken = (expectedTokenType: AuthTokenType = "accessToken") => {

    return async <T>(req: Request<T>, res: Response<ResponseMessage>, next: NextFunction) => {
        
        logger(MODULE, "Verifying auth tokens...")
        const token = req.headers.authorization?.split(" ")[1]

        if (!token) {
            const err = "No auth token was provided."
            logger(MODULE, err, LogType.ERR)
            return res.status(401).json({
                state: "unauthorized",
                message: err
            })
        }

        try {

            const authPayload = jwt.verify(token, process.env.JWT_SECRET as string, {
                clockTolerance: 300 // Allow slight timing skews
            }) as AuthTokenPayload

            const user = await User.findOne({ email: authPayload.email }).populate({
                path: 'membershipDetails',
                match: { _id: { $exists: true } }
            }) as IUserVerified | null

            if (!user) {
                const err = "User does not match token payload."
                logger(MODULE, err, LogType.ERR)
                return res.status(401).json({
                    state: "unauthorized",
                    message: "Invalid token."
                })
            }

            if (!isUserVerified(user)) {
                return res.status(401).json({
                    state: "unauthorized",
                    message: "Account is not verified."
                })
            }

            if (authPayload.tokenType !== expectedTokenType) {
                return res.status(401).json({
                    state: "unauthorized",
                    message: "Invalid Bearer token type."
                })
            }

            req.user = user
            logger(MODULE, "Auth tokens verified.")

            next()

        } catch (error) {

            if (error instanceof jwt.TokenExpiredError) {
                const err = "Token expired."
                logger(MODULE, err, LogType.ERR)
                return res.status(401).json({
                    state: "unauthorized",
                    message: err
                })
            }

            if (error instanceof jwt.JsonWebTokenError) {
                const err = "Invalid token. Check for mismatch of access and refresh tokens."
                logger(MODULE, err, LogType.ERR)
                return res.status(401).json({
                    state: "unauthorized",
                    message: err
                })
            }

            const err = "Failed to authenticate token."
            logger(MODULE, `${err} : ${error}`, LogType.WARN)
            return res.status(401).json({
                state: "unauthorized",
                message: err
            })
        }

    }
}