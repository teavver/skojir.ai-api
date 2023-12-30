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
        
        const ghSignature = req.headers['x-hub-signature-256'] as string
        const strBody = JSON.stringify(req.body, null, 2)

        const hmac = createHmac('sha256', process.env.GH_WEBHOOK_KEY || '')
        const digest = 'sha256=' + hmac.update(req.body).digest('hex')
        const valid = timingSafeEqual(Buffer.from(digest), Buffer.from(ghSignature))

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