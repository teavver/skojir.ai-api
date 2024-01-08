import { Request, Response } from "express";
import { logger, LogType } from "../../utils/logger.js";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { emailChangeOTP as emailChangeOTPService } from "../../services/user_services/emailChangeOTP.js";

const MODULE = "controllers :: user_controllers :: emailChangeOTP"

export async function emailChangeOTP(req: Request, res: Response<ResponseMessage>) {

    const sRes = await emailChangeOTPService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg
        })
    }

    logger(MODULE, `User ${sRes.data.email} requested an email change.`, LogType.SUCCESS)
    return res.status(200).json({
        state: "success",
        message: `Code sent. Please check your email for details`
    })

}