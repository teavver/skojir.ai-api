import { Request, Response } from "express";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";
import { loginUser as loginUserService } from "../../services/user_services/loginUser";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { logger } from "../../utils/logger.js";

const MODULE = "controllers :: user_controllers :: login"

export async function loginUser(req: Request<IUserCredentials>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`
        })
    }

    const userData: IUserCredentials = req.body
    const loginRes = await loginUserService(userData)

    if (loginRes.err) {
        return res.status(401).json({
            state: "unauthorized",
            message: loginRes.errMsg
        })
    }

    // generate access & refresh tokens for user
    


    
}