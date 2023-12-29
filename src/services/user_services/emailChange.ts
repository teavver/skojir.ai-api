import { User } from "../../models/User.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { logger, LogType } from "../../utils/logger.js";
import IUserVerification from "../../types/interfaces/IUserVerification.js";
import { validateRequest } from "../../utils/validateRequest.js";
import { AuthEmailChangeRequestResult, authEmailChangeSchema } from "../../middlewares/validators/schemas/auth/authVerificationSchema.js";

const MODULE = "services :: user_services :: emailChange"

export async function emailChange(reqBody:any): Promise<ServiceResponse<IUserVerification>> {

    const vRes = await validateRequest<AuthEmailChangeRequestResult>(MODULE, reqBody, authEmailChangeSchema)
    if (!vRes.isValid) {
        console.log(vRes.error)
        logger(MODULE, `email change req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: vRes.statusCode
        }
    }

    const reqData: IUserVerification = vRes.data
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
        // const prevEmail = user.email
        // Send email to old account & inform user about the change

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

    return {
        err: false,
        data: reqData,
        statusCode: 200
    }
}