import { Request, Response } from "express";
import { ResponseMessage } from "../types/responses/ResponseMessage.js";
import { asyncExec } from "../utils/asyncExec.js";

const MODULE = "controllers :: root"

export async function getRoot(req: Request, res: Response<ResponseMessage>) {
    const versionId = await asyncExec("git rev-parse --short HEAD", "Failed to get commit id from GH")
    return res.status(200).json({
        state: "success",
        message: `skojir api (${versionId})`
    })
}