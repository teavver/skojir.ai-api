import { Request, Response } from "express"
import { ResponseMessage } from "../types/responses/ResponseMessage.js"
import { logger } from "../utils/logger.js"
import { getStatus } from "../services/getStatus.js"

const MODULE = "controllers :: status"

export async function checkStatus(req: Request, res: Response<ResponseMessage>) {

    const statusRes = await getStatus()

    if (statusRes.err) {
        const err = `Status check unavailable`
        logger(MODULE, err)
        return res.status(statusRes.statusCode).json({
            state: "error",
            message: err
        })
    }
    
    logger(MODULE, "Status check OK")
    return res.status(statusRes.statusCode).json({
        state: "success",
        message: `${statusRes.data}`
    })

}