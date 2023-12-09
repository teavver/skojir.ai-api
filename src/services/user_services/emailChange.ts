import { User } from "../../models/User.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { logger, LogType } from "../../utils/logger.js";
import { validateEmailChange } from "../../middlewares/validators/user_services/emailChange.js";
import IUserVerification from "../../types/interfaces/IUserVerification.js";

const MODULE = "services :: user_services :: emailChange"

export async function emailChange(reqData: IUserVerification): Promise<ServiceResponse> {
 
    const vRes = await validateEmailChange(reqData)
    if (!vRes.isValid) {
        logger(MODULE, `email change req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: 400
        }
    }

    const user = await User.findOne({ email: reqData.email })
    if (!user || !user.verificationCodeExpires) {
        logger(MODULE, `Failed to change email - user does not exist`, LogType.WARN)
        return {
            err: true,
            errMsg: `Sorry, we couldn't find your account.`,
            statusCode: 404
        }
    }

    if (!user.isEmailVerified) {
        logger(MODULE, `Failed to change email - user account is unverified`, LogType.WARN)
        return {
            err: true,
            errMsg: `Only verified accounts can perform this action.`,
            statusCode: 401
        }
    }
    
    const oldEmail = user.email

    if (new Date() >= user.verificationCodeExpires) {
        return {
            err: true,
            errMsg: `Your email change OTP code expired.`,
            statusCode: 400
        }
    }

    if (reqData.verificationCode !== user.verificationCode) {
        return {
            err: true,
            errMsg: `Invalid OTP code.`,
            statusCode: 401
        }
    }

    try {
        await User.updateOne({ email: reqData.email }, {
            $set: {
                email: reqData.email
            },
            $unset: {
                verificationCode: "",
                verificationCodeExpires: ""
            }
        })
    } catch (err) {
        const dbErr = (err as Error).message
        logger(MODULE, dbErr, LogType.WARN)
        return {
            err: true,
            errMsg: `Internal database error.`,
            statusCode: 500,
        }
    }

    logger(MODULE, `User ${oldEmail} changed their email address to: ${reqData.email}`)
    return {
        err: false,
        data: ``,
        statusCode: 200
    }
}