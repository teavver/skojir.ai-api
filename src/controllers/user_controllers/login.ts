import { Request, Response } from "express";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";
import { loginUser as loginUserService } from "../../services/user_services/loginUser.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { generateAuthToken } from "../../middlewares/auth/genToken.js";
import { logger, LogType } from "../../utils/logger.js";
import { User } from "../../models/User.js";
import { IUserVerified } from "../../types/interfaces/IUserVerified.js";
import { LoginResponse } from "../../types/responses/LoginResponse.js";

const MODULE = "controllers :: user_controllers :: login"

export async function loginUser(req: Request<IUserCredentials>, res: Response<LoginResponse>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`
        })
    }

    const sRes = await loginUserService(req.body)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "unauthorized",
            message: sRes.errMsg,
        })
    }
    
    // generate access & refresh tokens for user
    const vData: IUserVerified = sRes.data
    const userAccessToken = generateAuthToken(vData, "accessToken")
    const userRefreshToken = generateAuthToken(vData, "refreshToken")
    
    await User.updateOne({ email: vData.email }, {
        $set: {
            accessToken: userAccessToken,
            refreshToken: userRefreshToken
        },
    })
    
    logger(MODULE, `User ${vData.email} logged in`, LogType.SUCCESS)
    return res.status(sRes.statusCode).json({
        state: "success",
        message: `User successfully logged in.`,
        tokens: {
            accessToken: userAccessToken,
            refreshToken: userRefreshToken
        }
    })
    
}