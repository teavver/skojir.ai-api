import { User } from "../../models/User.js";
import { Request, Response } from "express";
import { logger, LogType } from "../../utils/logger.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { deleteUser as deleteUserService } from "../../services/user_services/deleteUser.js";
import { IUserPassword } from "../../types/interfaces/IUserPassword.js";
import { IUserBase } from "../../types/interfaces/IUserBase.js";

const MODULE = "controllers :: user_controllers :: delete"

export async function deleteUser(req: Request<IUserPassword>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body, ["password"])
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: "Invalid request body."
        })
    }

    const sRes = await deleteUserService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg,
        })
    }

    const vData: IUserBase = sRes.data
    await User.deleteOne({ email: vData.email })
    logger(MODULE, `User ${vData.email} deleted their account`, LogType.SUCCESS)
    return res.status(200).json({
        state: "success",
        message: "Account deleted."
    })
    
}