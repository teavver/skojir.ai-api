import { Request, Response } from "express";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { logger, LogType } from "../../utils/logger.js";
import { IUserCredentials } from "../../types/interfaces/IUserCredentials.js";
import { createUser } from "../../services/user_services/createUser.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";

const MODULE = "controllers :: user_controllers :: register"

export async function registerUser(req: Request<IUserCredentials>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body, ["email", "password"])
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`
        })
    }

    const sRes: ServiceResponse<IUserCredentials> = await createUser(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "conflict",
            message: sRes.errMsg
        })
    }

    logger(MODULE, `User: ${sRes.data.email} created an account`, LogType.SUCCESS)
    return res.status(sRes.statusCode).json({
        state: "success",
        message: `Your account has been created. Please check your e-mail for a verification code.`
    })

}

