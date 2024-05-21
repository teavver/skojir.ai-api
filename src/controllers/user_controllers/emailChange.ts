import { Request, Response } from "express"
import { logger, LogType } from "../../utils/logger.js"
import { validateRequestBody } from "../../utils/verifyRequestBody.js"
import { ResponseMessage } from "../../types/responses/ResponseMessage.js"
import { emailChange as emailChangeService } from "../../services/user_services/emailChange.js"
import { IUserVerification } from "../../types/interfaces/IUserVerification.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { responseCodes } from "../../utils/responseCodes.js"

const MODULE = "controllers :: user_controllers :: emailChange"

export async function emailChange(req: Request<IUserVerification>, res: Response<ResponseMessage>) {
    const validBody = validateRequestBody(req.body, ["otp"])
    if (!validBody) {
        return res.status(responseCodes.BAD_REQUEST).json({
            state: "error",
            message: "Invalid request body.",
        })
    }

    const sRes: ServiceResponse<IUserVerification> = await emailChangeService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg,
        })
    }

    const vData: IUserVerification = sRes.data
    const oldEmail = req.user!.email
    logger(MODULE, `User ${oldEmail} changed their email to: ${vData.email}.`, LogType.SUCCESS)
    return res.status(200).json({
        state: "success",
        message: `Email successfully changed.`,
    })
}
