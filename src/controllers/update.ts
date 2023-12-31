import { Request, Response } from "express";
import { ResponseMessage } from "../types/responses/ResponseMessage.js";
import { logger, LogType } from "../utils/logger.js";
import { asyncExec } from '../utils/asyncExec.js';

const MODULE = "controllers :: update"

export async function performUpdate(req: Request, res: Response<ResponseMessage>) {

    logger(MODULE, "Update: Pulling newest updates from GitHub...", LogType.SERVER)
    await asyncExec("git pull origin main", "Failed to pull changes from gh")
    await asyncExec("yarn build", "Failed to build app")
    await asyncExec("pm2 restart skojir-api", "Failed to restart app after update")

    return res.status(200).json({
        state: "success",
        message: "OK"
    })
}
