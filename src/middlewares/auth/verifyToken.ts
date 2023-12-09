import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { AuthTokenPayload } from "../../types/AuthToken.js"
import { User } from "../../models/User.js"
import { IUserVerified } from "../../types/interfaces/IUserVerified.js"
import { logger, LogType } from "../../utils/logger.js"
import { AuthRequest } from "../../types/requests/AuthRequest.js"
import { ResponseMessage } from "../../types/responses/ResponseMessage.js"

const MODULE = "middlewares :: auth :: verifyToken"

/**
 * Authenticate user's access token
 */
export async function verifyToken(req: Request<AuthRequest>, res: Response<ResponseMessage>, next: NextFunction): Promise<void> {

    logger(MODULE, "Verifying auth tokens...")
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        const err = "No auth token was provided"
        logger(MODULE, err, LogType.ERR)
        res.status(401).json({
            state: "unauthorized",
            message: err
        })
        return
    }

    try {

        const authPayload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthTokenPayload

        const user = await User.findOne({ email: authPayload.email })
        if (!user) {
            const err = "User does not match token payload."
            logger(MODULE, err, LogType.ERR)
            res.status(401).json({
                state: "unauthorized",
                message: "Invalid token"
            })
            return
        }

        req.body.user = user as IUserVerified
        logger(MODULE, "Auth tokens verified.")

        next()

    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            const err = "Token expired."
            logger(MODULE, err, LogType.ERR)
            res.status(401).json({
                state: "unauthorized",
                message: err
            })
            return
        }

        if (error instanceof jwt.JsonWebTokenError) {
            const err = "Invalid token. Check for mismatch of access and refresh tokens"
            logger(MODULE, err, LogType.ERR)
            res.status(401).json({
                state: "unauthorized",
                message: err
            })
            return
        }

        const err = "Failed to authenticate token"
        logger(MODULE, err, LogType.ERR)
        res.status(401).json({
            state: "unauthorized",
            message: err
        })
        return
    }
}