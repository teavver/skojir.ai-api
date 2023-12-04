import { Request, Response } from "express";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { logger } from "../../utils/logger.js";
import { AuthCredentialsRequest } from "../../types/requests/AuthCredentialsRequest.js";
import { User } from "../../models/User.js";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { deleteUser as deleteUserService } from "../../services/user_services/deleteUser.js";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";

const MODULE = "controllers :: user_controllers :: delete"

export async function deleteUser(req: Request<AuthCredentialsRequest>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: "Invalid request body."
        })
    }

    const userData: IUserCredentials = req.body
    const delRes = await deleteUserService(userData)
    if (delRes.err) {
        return res.status(delRes.statusCode).json({
            state: "error",
            message: delRes.errMsg,
        })
    }

    // TODO:
    // Schedule deletion for in n days instead of instant
    // If active membership, warn user

    await User.deleteOne({ email: req.body.user.email })
    logger(MODULE, `User ${req.body.user.email} deleted their account.`)

    return res.status(200).json({
        state: "success",
        message: "Account deleted."
    })
    
}