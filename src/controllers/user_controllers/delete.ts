import { Request, Response } from "express";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { logger } from "../../utils/logger.js";
import { AuthCredentialsRequest } from "../../types/requests/AuthCredentialsRequest.js";
import { User } from "../../models/User.js";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";

const MODULE = "controllers :: user_controllers :: delete"

export async function deleteUser(req: Request<AuthCredentialsRequest>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: "Invalid request body."
        })
    }

    // TODO: add a service for 'deleteUser'
    // Schedule deletion for in n days
    // If active membership, warn user

    await User.deleteOne({ email: req.body.user.email })
    logger(MODULE, `User ${req.body.user.email} deleted their account.`)

    return res.status(200).json({
        state: "success",
        message: "Account deleted."
    })
    
}