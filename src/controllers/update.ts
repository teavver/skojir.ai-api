import { exec } from 'child_process';
import { Request, Response } from "express";
import { ResponseMessage } from "../types/responses/ResponseMessage.js";
import { logger, LogType } from "../utils/logger.js";

const MODULE = "controllers :: selfUpdate"

export async function performUpdate(req: Request, res: Response<ResponseMessage>) {

    logger(MODULE, 'Pulling newest updates from GitHub...')
    exec('git pull origin main', (err, stdout, stderr) => {
        if (err) {
            logger(MODULE, `Failed to pull changes from gh. Err: ${err}`, LogType.ERR)
        }

        logger(MODULE, `Logs: ${stdout}`, LogType.SERVER)
        logger(MODULE, `Err: ${stderr}`, LogType.SERVER)
    })
    
    exec('pm2 restart skojir-api', (err, stdout, stderr) => {
        if (err) {
            logger(MODULE, `Failed to restart app. Err: ${err}`, LogType.ERR)
        }

        logger(MODULE, `Logs: ${stdout}`, LogType.SERVER)
        logger(MODULE, `Err: ${stderr}`, LogType.SERVER)
    })
    
    return res.status(200).json({
        state: "success",
        message: "OK"
    })
}
