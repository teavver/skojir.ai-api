import { Request, Response } from "express";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";
import { loginUser as loginUserService } from "../../services/user_services/loginUser.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { generateAuthToken } from "../../middlewares/auth/genToken.js";
import { logger } from "../../utils/logger.js";
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

    const userData: IUserCredentials = req.body
    const loginRes = await loginUserService(userData)
    if (loginRes.err) {
        return res.status(loginRes.statusCode).json({
            state: "unauthorized",
            message: loginRes.errMsg,
        })
    }

    // generate access & refresh tokens for user
    const user = loginRes.data as IUserVerified
    const userAccessToken = generateAuthToken(user, "accessToken")
    const userRefreshToken = generateAuthToken(user, "refreshToken")

    await User.updateOne({ email: user.email }, {
        $set: {
            accessToken: userAccessToken,
            refreshToken: userRefreshToken
        },
    })

    logger(MODULE, `User ${user.email} logged in.`)
    return res.status(loginRes.statusCode).json({
        state: "success",
        message: `User successfully logged in.`,
        tokens: {
            accessToken: userAccessToken,
            refreshToken: userRefreshToken
        }
    })
    
}