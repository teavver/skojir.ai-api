import { Request, Response } from "express";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { logger } from "../../utils/logger.js";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";
import { createUser } from "../../services/user_services/createUser.js";
import { generateVerificationCode } from "../../utils/crypto/genVerificationCode.js";
import { sendVerificationCodeEmail } from "../../services/user_services/sendVerificationCodeEmail.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";

const MODULE = "controllers :: user_controllers :: register"

export async function registerUser(req: Request<IUserCredentials>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`
        })
    }

    const userData: IUserCredentials = req.body
    const verCode = generateVerificationCode()

    const createRes = await createUser(userData, verCode)
    if (createRes.err) {
        return res.status(createRes.statusCode).json({
            state: "conflict",
            message: createRes.errMsg
        })
    }

    // send verification email to new user
    const emailRes = await sendVerificationCodeEmail(userData.email, verCode)
    if (emailRes.err) {
        return res.status(emailRes.statusCode).json({
            state: "error",
            message: emailRes.errMsg
        })
    }

    const successMsg = `User: ${userData.email} created an account`
    logger(MODULE, successMsg)

    return res.status(emailRes.statusCode).json({
        state: "success",
        message: `Your account has been created. Please check your e-mail for a verification code.`
    })

}

