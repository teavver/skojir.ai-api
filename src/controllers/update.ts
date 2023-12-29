import { Request, Response } from "express";
import { ResponseMessage } from "../types/responses/ResponseMessage.js";
import { logger, LogType } from "../utils/logger.js";

const MODULE = "controllers :: update"

export async function postUpdate(req: Request, res: Response<ResponseMessage>) {
    logger(MODULE, req.body, LogType.SERVER)
}