import { Request, Response } from "express";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { AuthRequestBase } from "../../types/requests/AuthRequestBase.js";
import IUserBase from "../../types/interfaces/IUserBase.js";
import { emailOTP as emailOTPService } from "../../services/user_services/emailOTP.js";

const MODULE = "controllers :: user_controllers :: emailOTP"

export async function emailOTP(req: Request<AuthRequestBase>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: "Invalid request body."
         })
    }

    const userData: IUserBase = req.body
    const sRes = await emailOTPService(userData)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg
        })
    }

    return res.status(200).json({
        state: "success",
        message: `Code sent. Please check your email for details`
    })

}