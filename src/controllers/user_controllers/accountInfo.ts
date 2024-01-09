import { Request, Response } from "express";
import { logger, LogType } from "../../utils/logger.js";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { accountInfo as accountInfoService } from "../../services/user_services/accountInfo.js";

const MODULE = "controllers :: user_controllers :: accountInfo"

export async function accountInfo(req: Request, res: Response<ResponseMessage>) {

    const sRes = await accountInfoService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "error",
            message: sRes.errMsg
        })
    }

    const userData = JSON.stringify(sRes.data)
    logger(MODULE, `getUser: ${sRes.data.email}`, LogType.SUCCESS)
    return res.status(200).json({
        state: "success",
        message: userData
    })

}