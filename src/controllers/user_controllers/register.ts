import { Request, Response } from "express";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { logger, LogType } from "../../utils/logger.js";
import { IUserCredentials } from "../../types/express/interfaces/IUserCredentials.js";
import { createUser } from "../../services/user_services/createUser.js";
import { generateVerificationCode } from "../../utils/crypto/genVerificationCode.js";
import { sendEmailToUser } from "../../utils/sendEmailToUser.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";

const MODULE = "controllers :: user_controllers :: register"

export async function registerUser(req: Request<IUserCredentials>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body, ["email", "password"])
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`
        })
    }

    const verCode = generateVerificationCode()
    const sRes = await createUser(req, verCode)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "conflict",
            message: sRes.errMsg
        })
    }

    // send verification email to new user
    const vData: IUserCredentials = sRes.data
    const emailRes = await sendEmailToUser(
        vData.email,
        `Welcome to skojir!`,
        `Use this code to activate your account: ${verCode}`,
    )
    if (emailRes.err) {
        return res.status(emailRes.statusCode).json({
            state: "error",
            message: emailRes.errMsg
        })
    }

    logger(MODULE, `User: ${vData.email} created an account`, LogType.SUCCESS)
    return res.status(emailRes.statusCode).json({
        state: "success",
        message: `Your account has been created. Please check your e-mail for a verification code.`
    })

}

