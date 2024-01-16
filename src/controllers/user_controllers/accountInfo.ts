import { Request, Response } from "express"
import { logger, LogType } from "../../utils/logger.js"
import { ResponseMessageExt } from "../../types/responses/ResponseMessage.js"
import { accountInfo as accountInfoService } from "../../services/user_services/accountInfo.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { AccountInfoResponse } from "../../types/responses/AccountInfoResponse.js"

const MODULE = "controllers :: user_controllers :: accountInfo"

export async function accountInfo(req: Request, res: Response<ResponseMessageExt>) {
    const sRes: ServiceResponse<AccountInfoResponse> = await accountInfoService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg,
        })
    }

    logger(MODULE, `getUser: ${sRes.data.email}`, LogType.SUCCESS)
    return res.status(sRes.statusCode).json({
        state: "success",
        message: "OK",
        user: sRes.data,
    })
}
