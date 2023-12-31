import { exec, execSync } from 'child_process';
import { Request, Response } from "express";
import { ResponseMessage } from "../types/responses/ResponseMessage.js";
import { logger, LogType } from "../utils/logger.js";

const MODULE = "controllers :: selfUpdate"

export async function performUpdate(req: Request, res: Response<ResponseMessage>) {

    const oldVerId = execSync('git rev-parse HEAD').toString().slice(0, 7)
    logger(MODULE, 'Update: Pulling newest updates from GitHub...', LogType.SERVER)

    exec('git pull origin main', (err, stdout, stderr) => {
        if (err) {
            logger(MODULE, `Failed to pull changes from gh. Err: ${err}`, LogType.ERR)
        }

        logger(MODULE, `Stdout: ${stdout}`, LogType.SERVER)
        logger(MODULE, `Stderr: ${stderr}`, LogType.SERVER)
    })

    exec('yarn build', (err, stdout, stderr) => {
        if (err) {
            logger(MODULE, `Failed to build the app. Err: ${err}`, LogType.ERR)
            return
        }
        logger(MODULE, `Stdout: ${stdout}`, LogType.SERVER)
        logger(MODULE, `Stderr: ${stderr}`, LogType.SERVER)
    })
    
    exec('pm2 restart skojir-api', (err, stdout, stderr) => {
        if (err) {
            logger(MODULE, `Failed to restart app after update. Err: ${err}`, LogType.ERR)
        }

        logger(MODULE, `Stdout: ${stdout}`, LogType.SERVER)
        logger(MODULE, `Stderr: ${stderr}`, LogType.SERVER)
    })

    const newVerId = execSync('git rev-parse HEAD').toString().slice(0, 7)
    logger(MODULE, `Automatic update complete. (${oldVerId} -> ${newVerId})`, LogType.SUCCESS)
    
    return res.status(200).json({
        state: "success",
        message: "OK"
    })
}
