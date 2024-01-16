import { Request, Response } from "express"
import { logger, LogType } from "../utils/logger.js"
import { ResponseMessageExt } from "../types/responses/ResponseMessage.js"
import { refreshAuthTokens as refreshAuthTokensService } from "../services/refreshAuthTokens.js"
import { UserAuthTokens } from "../types/AuthToken.js"

const MODULE = "controllers :: refreshAuthTokens"

export async function refreshAuthTokens(req: Request, res: Response<ResponseMessageExt>) {
    const sRes = await refreshAuthTokensService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg,
        })
    }

    const tokens: UserAuthTokens = sRes.data
    logger(MODULE, `Refreshed tokens for user: ${req.user!.email}`, LogType.SUCCESS)
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
    })
    return res.status(sRes.statusCode).json({
        state: "success",
        message: "OK",
        tokens: {
            accessToken: tokens.accessToken,
            membershipToken: tokens.membershipToken,
        },
    })
}
