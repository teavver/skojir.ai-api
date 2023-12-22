import { Request, Response } from "express";
import { logger, LogType } from "../../utils/logger.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { AuthVerificationRequest } from "../../types/requests/AuthVerificationRequest.js";
import { emailChange as emailChangeService } from "../../services/user_services/emailChange.js";
import IUserVerification from "../../types/interfaces/IUserVerification.js";

const MODULE = "controllers :: user_controllers :: emailChange"

export async function emailChange(req: Request<AuthVerificationRequest>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: "Invalid request body."
         })
    }

    const sRes = await emailChangeService(req.body)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg
        })
    }
    
    const vData: IUserVerification = sRes.data
    const oldEmail = req.body.user.email
    logger(MODULE, `User ${oldEmail} changed their email to: ${vData.email}.`, LogType.SUCCESS)
    return res.status(200).json({
        state: "success",
        message: `Email successfully changed.`
    })

}