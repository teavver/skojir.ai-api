import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import { Request, Response } from "express";
import { ResponseMessage } from "../types/responses/ResponseMessage.js";
import { logger, LogType } from "../utils/logger.js";
import { asyncExec } from '../utils/asyncExec.js';

const MODULE = "controllers :: update"

const exec = promisify(execCallback)

export async function performUpdate(req: Request, res: Response<ResponseMessage>) {

    const oldVerId = (await exec('git rev-parse HEAD')).toString().slice(0, 7)
    logger(MODULE, "Update: Pulling newest updates from GitHub...", LogType.SERVER)

    await asyncExec("git pull origin main", "Failed to pull changes from gh")
    await asyncExec("yarn build", "Failed to build app")
    await asyncExec("pm2 restart skojir-api", "Failed to restart app after update")

    const newVerId = (await exec("git rev-parse HEAD")).toString().slice(0, 7)
    logger(MODULE, `Automatic update complete. (${oldVerId} -> ${newVerId})`, LogType.SUCCESS)
    
    return res.status(200).json({
        state: "success",
        message: "OK"
    })
}
