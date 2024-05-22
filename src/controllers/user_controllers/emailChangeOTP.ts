import { Request, Response } from "express"
import { logger, LogType } from "../../utils/logger.js"
import { ResponseMessage } from "../../types/responses/ResponseMessage.js"
import { emailChangeOTP as emailChangeOTPService } from "../../services/user_services/emailChangeOTP.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { IUserBase } from "../../types/interfaces/IUserBase.js"
import { responseCodes } from "../../utils/responseCodes.js"

const MODULE = "controllers :: user_controllers :: emailChangeOTP"

export async function emailChangeOTP(req: Request, res: Response<ResponseMessage>) {
    const sRes: ServiceResponse<IUserBase> = await emailChangeOTPService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg,
        })
    }

    logger(MODULE, `User ${sRes.data.email} requested an email change.`, LogType.SUCCESS)
    return res.status(responseCodes.SUCCESS).json({
        state: "success",
        message: `Code sent. Please check your email for details.`,
    })
}
