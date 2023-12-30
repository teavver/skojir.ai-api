import { appendFileSync } from "fs";
import { createHmac, timingSafeEqual } from "crypto";
import { Request, Response, NextFunction } from "express"
import { logger, LogType } from "../../utils/logger.js"
import { ResponseMessage } from "../../types/responses/ResponseMessage.js"

const MODULE = "middlewares :: auth :: verifyGH"

/**
 * Authenticate webhook events from GitHub
 */

export async function verifyGH(req: Request, res: Response<ResponseMessage>, next: NextFunction) {

    try {

        logger(MODULE, "Verifying GH Webhook request...")
        
        const strBody = JSON.stringify(req.body, null, 2)
        const reqSign = req.headers['x-hub-signature-256'] as string

        if (!reqSign) {
            return res.status(401).json({
                state: "unauthorized",
                message: "Missing signature"
            })
        }

        const key = process.env.GH_WEBHOOK_KEY as string
        const signature = createHmac("sha256", key).update(JSON.stringify(req.body)).digest("hex")
        let trusted = Buffer.from(`sha256=${signature}`, 'ascii')
        let untrusted =  Buffer.from(reqSign, 'ascii')
        const valid = timingSafeEqual(trusted, untrusted)

        if (!valid) {
            return res.status(401).json({
                state: "unauthorized",
                message: "Failed to authenticate request"
            })
        }

        appendFileSync('self_update_logs.txt', `${strBody}\n`, 'utf8')
        logger(MODULE, strBody, LogType.SERVER)

        if (req.body.action !== "completed" && req.body.workflow_run.conclusion !== "success") {
            next()
        }

    } catch (err) {

        const errMsg = (err as Error).message
        logger(MODULE, errMsg, LogType.ERR)
        return res.status(401).json({
            state: "unauthorized",
            message: errMsg
        })

    }


}