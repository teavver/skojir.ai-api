import { createHmac, timingSafeEqual } from "crypto"
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
        const reqSign = req.headers["x-hub-signature-256"] as string

        if (!reqSign) {
            logger(MODULE, `Failed to validate Update req - missing signature header`, LogType.ERR)
            return res.status(401).json({
                state: "unauthorized",
                message: "Missing signature",
            })
        }

        const key = process.env.GH_WEBHOOK_KEY as string
        const signature = createHmac("sha256", key).update(JSON.stringify(req.body)).digest("hex")
        const trusted = Buffer.from(`sha256=${signature}`, "ascii")
        const untrusted = Buffer.from(reqSign, "ascii")
        const valid = timingSafeEqual(trusted, untrusted)

        if (!valid) {
            logger(MODULE, `Failed to validate Update req - wrong signature`, LogType.ERR)
            return res.status(401).json({
                state: "unauthorized",
                message: "Failed to authenticate request",
            })
        }

        logger(MODULE, `GH Webhook request verified.`)
        if (req.body.workflow_run.status === "completed" && req.body.workflow_run.conclusion === "success") {
            logger(MODULE, `Starting self-update...`, LogType.SERVER)
            return next()
        }

        return res.status(200).json({
            state: "success",
            message: "OK",
        })
    } catch (err) {
        const errMsg = (err as Error).message
        logger(MODULE, errMsg, LogType.ERR)
        return res.status(401).json({
            state: "unauthorized",
            message: errMsg,
        })
    }
}
