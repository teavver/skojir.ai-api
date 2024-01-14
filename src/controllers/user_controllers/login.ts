import { Request, Response } from "express";
import { loginUser as loginUserService } from "../../services/user_services/loginUser.js";
import { validateRequestBody } from "../../utils/verifyRequestBody.js";
import { LoginResponse } from "../../types/responses/LoginResponse.js";
import { IUserCredentialsExt } from "../../types/interfaces/IUserCredentials.js";
import { UserAuthTokens } from "../../types/AuthToken.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";

const MODULE = "controllers :: user_controllers :: login"

export async function loginUser(req: Request<IUserCredentialsExt>, res: Response<LoginResponse>) {

    const validBody = validateRequestBody(req.body, ["email", "password", "deviceId"])
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`
        })
    }

    const sRes: ServiceResponse<UserAuthTokens> = await loginUserService(req)
    if (sRes.err) {
        return res.status(sRes.statusCode).json({
            state: "unauthorized",
            message: sRes.errMsg,
        })
    }
    
    const authTokens: UserAuthTokens = sRes.data

    res.cookie('refreshToken', authTokens.refreshToken, { httpOnly: true, secure: true });
    return res.status(sRes.statusCode).json({
        state: "success",
        message: `User successfully logged in.`,
        accessToken: authTokens.accessToken,
        membershipToken: authTokens.membershipToken && authTokens.membershipToken
    })
    
}