import { Request, Response } from "express";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { AuthVerificationRequest } from "../../types/requests/AuthVerificationRequest.js";
import IUserVerification from "../../types/interfaces/IUserVerification.js";
import { emailChange as emailChangeService } from "../../services/user_services/emailChange.js";

const MODULE = "controllers :: user_controllers :: emailChange"

export async function emailChange(req: Request<AuthVerificationRequest>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: "Invalid request body."
         })
    }

    const reqData: IUserVerification = req.body
    const sRes = await emailChangeService(reqData)
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