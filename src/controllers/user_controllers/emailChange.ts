import { Request, Response } from "express";
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

    const { email, verificationCode } = req.body
    const userData: IUserVerification = { email, verificationCode }
    const sRes = await emailChangeService(userData)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg
        })
    }

    return res.status(200).json({
        state: "success",
        message: `Email successfully changed.`
    })

}