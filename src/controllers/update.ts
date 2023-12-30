import { Request, Response } from "express";
import { ResponseMessage } from "../types/responses/ResponseMessage.js";
import { logger, LogType } from "../utils/logger.js";
import { appendFileSync } from 'fs';

const MODULE = "controllers :: update"

export async function postUpdate(req: Request, res: Response<ResponseMessage>) {
    
    const bodyStr = JSON.stringify(req.body, null, 2)
    appendFileSync('update_logs.txt', `${bodyStr}\n`, 'utf8')
    
    logger(MODULE, bodyStr, LogType.SERVER)
    return res.status(200).json({
        state: "success",
        message: ""
    });
}
