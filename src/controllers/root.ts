import { Request, Response } from "express";
import { ResponseMessage } from "../types/responses/ResponseMessage.js";

const MODULE = "controllers :: root"

export async function getRoot(req: Request, res: Response<ResponseMessage>) {
    return res.status(200).json({
        state: "success",
        message: "skojir.ai"       
    })
}