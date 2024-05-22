import { Request, Response } from "express"
import { logger, LogType } from "../../utils/logger.js"
import { validateRequestBody } from "../../utils/verifyRequestBody.js"
import { ResponseMessage } from "../../types/responses/ResponseMessage.js"
import { pwdChange as pwdChangeService } from "../../services/user_services/pwdChange.js"
import { IUserPwdChange } from "../../types/interfaces/IUserVerification.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { responseCodes } from "../../utils/responseCodes.js"

const MODULE = "controllers :: user_controllers :: pwdChange"

export async function pwdChange(req: Request<IUserPwdChange>, res: Response<ResponseMessage>) {
    const validBody = validateRequestBody(req.body, ["otp", "newPwd"])
    if (!validBody) {
        return res.status(responseCodes.BAD_REQUEST).json({
            state: "error",
            message: "Invalid request body.",
        })
    }

    const sRes: ServiceResponse<IUserPwdChange> = await pwdChangeService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg,
        })
    }

    logger(MODULE, `User ${req.user!.email} just changed their password.`, LogType.SUCCESS)
    return res.status(responseCodes.SUCCESS).json({
        state: "success",
        message: `Password successfully changed.`,
    })
}
