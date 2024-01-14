import { Request, Response } from "express"
import { ResponseMessage } from "../types/responses/ResponseMessage.js"
import { logger } from "../utils/logger.js"
import { getStatus } from "../services/getStatus.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"

const MODULE = "controllers :: status"

export async function checkStatus(req: Request, res: Response<ResponseMessage>) {

    const sRes: ServiceResponse<string> = await getStatus()

    if (sRes.err) {
        const err = `Status check unavailable`
        logger(MODULE, err)
        return res.status(sRes.statusCode).json({
            state: "error",
            message: err
        })
    }
    
    logger(MODULE, "Status check OK")
    return res.status(sRes.statusCode).json({
        state: "success",
        message: `${sRes.data}`
    })

}