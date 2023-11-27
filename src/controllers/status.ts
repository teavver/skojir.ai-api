import { Request, Response } from "express"
import { ResponseMessage } from "../types/responses/ResponseMessage.js"
import { logger } from "../utils/logger.js"
import { getStatus } from "../services/getStatus.js"

const MODULE = "controllers :: status"

export async function checkStatus(req: Request, res: Response<ResponseMessage>) {

    const statusRes = await getStatus()

    if (statusRes.err) {
        logger(MODULE, `Status check unavailable`)
        return res.status(503).json({
            state: "error",
            message: `API is offline`
        })
    }
    
    logger(MODULE, "Status check OK")
    return res.status(200).json({
        state: "success",
        message: `${statusRes.data}`
    })

}