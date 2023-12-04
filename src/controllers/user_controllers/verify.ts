import { Request, Response } from "express";
import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
import { verifyUser as verifyService } from "../../services/user_services/verifyUser.js";
import IUserVerification from "../../types/interfaces/IUserVerification.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";

const MODULE = "controllers :: user_controllers :: verify"

export async function verifyUser(req: Request<IUserVerification>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete.`
        })
    }

    const verificationData: IUserVerification = req.body
    
    const vRes = await verifyService(verificationData)
    if (vRes.err) {
        return res.status(vRes.statusCode).json({
            state: "unauthorized",
            message: vRes.errMsg
        })
    }

    return res.status(vRes.statusCode).json({
        state: "success",
        message: `User account verified.`
    })

}