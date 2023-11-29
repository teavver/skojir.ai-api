import { Request, Response } from "express";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { logger, LogType } from "../../utils/logger.js";
import { RegisterRequest } from "../../types/requests/client/RegisterRequest.js";
import { createUser } from "../../services/user_services/createUser.js";
import { generateVerificationCode } from "../../utils/generateVerificationCode.js";
import { sendVerificationCodeEmail } from "../../services/user_services/sendVerificationCodeEmail.js";

const MODULE = "controllers :: user_controllers :: register"

export async function registerUser(req: Request<RegisterRequest>, res: Response<ResponseMessage>) {

    const userData: RegisterRequest = req.body
    const verCode = generateVerificationCode()

    const createRes = await createUser(userData, verCode)
    if (createRes.err) {
        return res.status(409).json({
            state: "conflict",
            message: createRes.errMsg
        })
    }

    // send verification email to new user
    const emailRes = await sendVerificationCodeEmail(userData.email, verCode)
    if (emailRes.err) {
        return res.status(500).json({
            state: "error",
            message: emailRes.errMsg
        })
    }

    const successMsg = `User: ${userData.email} created an account`
    logger(MODULE, successMsg)

    return res.status(200).json({
        state: "success",
        message: `Your account has been created. Please check your e-mail for a verification code.`
    })

}

