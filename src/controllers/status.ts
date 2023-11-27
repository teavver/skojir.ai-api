import { Response } from "express"
import { ResponseMessage } from "../types/responses/ResponseMessage.js"
import { logger } from "../utils/logger.js"
import { getStatus } from "../services/getStatus.js"

const MODULE = "controllers :: status"

export async function checkStatus(res: Response<ResponseMessage>) {

    const ts = new Date().toLocaleTimeString()
    const statusRes = await getStatus()

    if (statusRes.err) {
        logger(MODULE, `Status check unavailable`)
        return res.status(503).json({
            state: "error",
            message: `(${ts}) API is not available`
        })
    }
    
    logger(MODULE, "Status check OK")
    return res.status(200).json({
        state: "success",
        message: `${statusRes.data}`
    })

}