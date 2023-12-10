import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";
import { validateLoginUserRequest } from "../../middlewares/validators/user_services/loginUser.js";
import { deriveKey } from "../../utils/crypto/pbkdf2.js";
import { logger, LogType } from "../../utils/logger.js";
import { User } from "../../models/User.js";

const MODULE = "services :: user_services :: loginUser"

export async function loginUser(reqBody:any): Promise<ServiceResponse<IUserCredentials>> {

    const vRes = await validateLoginUserRequest(reqBody)
    if (!vRes.isValid) {
        logger(MODULE, `loginUser req rejected: Failed to validate input`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: 400
        }
    }

    const vData = vRes.data as IUserCredentials
    const user = await User.findOne({ email: vData.email })
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

    if (!user.isEmailVerified) {
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

    const saltedPwd = vData.password + user.salt
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
        data: vData,
        statusCode: 200
    }

}