import { IUserBase } from "../../types/interfaces/IUserBase.js";
import { Request, Response } from "express";
import { logger, LogType } from "../../utils/logger.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { emailOTP as emailOTPService } from "../../services/user_services/emailOTP.js";

const MODULE = "controllers :: user_controllers :: emailOTP"

export async function emailOTP(req: Request, res: Response<ResponseMessage>) {

    // const validBody = validateRequestBody(req.body)
    // if (!validBody) {
    //     return res.status(400).json({
    //         state: "error",
    //         message: "Invalid request body."
    //      })
    // }

    const sRes = await emailOTPService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg
        })
    }

    // const vData: IUserBase = sRes.data
    logger(MODULE, `User ${sRes.data.email} requested an email change.`, LogType.SUCCESS)
    return res.status(200).json({
        state: "success",
        message: `Code sent. Please check your email for details`
    })

}