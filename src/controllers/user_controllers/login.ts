import { Request, Response } from "express";
import { loginUser as loginUserService } from "../../services/user_services/loginUser.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { generateAuthToken } from "../../middlewares/auth/genToken.js";
import { logger, LogType } from "../../utils/logger.js";
import { User } from "../../models/User.js";
import { IUserVerified } from "../../types/interfaces/IUserVerified.js";
import { LoginResponse } from "../../types/responses/LoginResponse.js";
import { IUserCredentialsExt } from "../../types/interfaces/IUserCredentials.js";
import { isNewDeviceId } from "../../utils/isNewDeviceId.js";
import { IDeviceID } from "../../types/interfaces/IDeviceID.js";
import { UserRefreshToken } from "../../types/interfaces/IUserVerified.js";

const MODULE = "controllers :: user_controllers :: login"

export async function loginUser(req: Request<IUserCredentialsExt>, res: Response<LoginResponse>) {

    const validBody = validateRequestBody(req.body, ["email", "password", "deviceId"])
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`
        })
    }

    const sRes = await loginUserService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "unauthorized",
            message: sRes.errMsg,
        })
    }
    
    const userData: IUserVerified = sRes.data
    const userAccessToken = generateAuthToken(userData, "accessToken")
    const userRefreshToken = generateAuthToken(userData, "refreshToken")

    // Device UUID Lookup
    const reqDeviceId: IDeviceID = req.body.deviceId
    const isNewDevice = isNewDeviceId(userData, reqDeviceId)

    if (isNewDevice) {
        const newToken: UserRefreshToken = {
            deviceId: reqDeviceId,
            token: userRefreshToken
        }
        await User.updateOne(
            { email: userData.email }, 
            { $push: { refreshTokens: newToken } }
        )
    } else {
        await User.updateOne(
            { email: userData.email, 'refreshTokens.deviceId': reqDeviceId },
            { $set: { 'refreshTokens.$.token': userRefreshToken } }
        )
    }

    const deviceMsg = isNewDevice ? "(new device)" : "(existing device)"
    logger(MODULE, `User ${userData.email} logged in. ${deviceMsg}`, LogType.SUCCESS)

    res.cookie('refreshToken', userRefreshToken, { httpOnly: true, secure: true });
    return res.status(sRes.statusCode).json({
        state: "success",
        message: `User successfully logged in.`,
        accessToken: userAccessToken
    })
    
}