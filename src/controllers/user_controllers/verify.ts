import { Request, Response } from "express";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { verifyUser as verifyService } from "../../services/user_services/verifyUser.js";
import { VerifyRequest } from "../../types/requests/client/VerifyRequest.js";

const MODULE = "controllers :: user_controllers :: verify"

export async function verifyUser(req: Request<VerifyRequest>, res: Response<ResponseMessage>) {

    const userData: VerifyRequest = req.body
    
    const verifyRes = await verifyService(userData)
    if (verifyRes.err) {
        return res.status(401).json({
            state: "unauthorized",
            message: verifyRes.errMsg
        })
    }

    return res.status(200).json({
        state: "success",
        message: verifyRes.data
    })

}