import { Request, Response } from "express";
import { ResponseMessage } from "../types/responses/ResponseMessage.js";
import { asyncExec } from "../utils/asyncExec.js";

export async function getRoot(req: Request, res: Response<ResponseMessage>) {
    const versionId = (await asyncExec("git rev-parse HEAD", "Failed to get commit id from GH")).slice(0, 7)
    return res.status(200).json({
        state: "success",
        message: `skojir api (${versionId})`
    })
}