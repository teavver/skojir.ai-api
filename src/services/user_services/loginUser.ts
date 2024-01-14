import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { deriveKey } from "../../utils/crypto/pbkdf2.js";
import { Request } from "express";
import { userCredentialsExtSchema } from "../../middlewares/validators/schemas/userCredentialsSchema.js";
import { validateRequest } from "../../utils/validateRequest.js";
import { logger, LogType } from "../../utils/logger.js";
import { User } from "../../models/User.js";
import { IUserVerified } from "../../types/interfaces/IUserVerified.js";
import { IUserCredentialsExt } from "../../types/interfaces/IUserCredentials.js";
import { isUserVerified } from "../../utils/isUserVerified.js";

const MODULE = "services :: user_services :: loginUser"

export async function loginUser(req:Request<IUserCredentialsExt>): Promise<ServiceResponse<IUserVerified>> {

    const userCredentialsExt: IUserCredentialsExt = {
        email: req.body.email,
        password: req.body.password,
        deviceId: req.body.deviceId
    }

    const vRes = await validateRequest<IUserCredentialsExt>(MODULE, userCredentialsExt, userCredentialsExtSchema)
    if (!vRes.isValid) {
        logger(MODULE, `loginUser req rejected: Failed to validate input`, LogType.WARN)
        return {
            err: true,
            errMsg: `Incorrect password.`,
            statusCode: vRes.statusCode
        }
    }

    const user = await User.findOne({ email: userCredentialsExt.email })
    if (!user) {
        logger(MODULE, `Failed to login user. Reason: No account matches user email`, LogType.WARN)
        return {
            err: true,
            errMsg: `Sorry, we couldn't find your account.
                Please double check your email address.
                If you haven't created an account yet, sign up using the "Create Account" button.
                `,
            statusCode: 404
        }
    }

    const userVerified = isUserVerified(user)
    if (!userVerified) {
        logger(MODULE, `Failed to login user. Reason: Account not verified`, LogType.WARN)
        return {
            err: true,
            errMsg: `
                You need to verify your account first.
                Check your email inbox for the verification code or click here to create a new one.
                `,
            statusCode: 409
        }
    }

    const saltedPwd = userCredentialsExt.password + user.salt
    const hashedPwd = deriveKey({ password: saltedPwd, salt: user.salt })

    if (hashedPwd !== user.password) {
        logger(MODULE, `loginUser req rejected: Invalid password`, LogType.WARN)
        return {
            err: true,
            errMsg: `
                Incorrect password.
                If you've forgotten your password, you can reset it using the "Forgot Password" button.
                `,
            statusCode: 400
        }
    }


    return {
        err: false,
        data: user,
        statusCode: 200
    }

}