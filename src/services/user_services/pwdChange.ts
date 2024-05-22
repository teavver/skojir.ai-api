import { User } from "../../models/User.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { logger, LogType } from "../../utils/logger.js"
import { validateRequest } from "../../utils/validateRequest.js"
import { IUserPwdChange } from "../../types/interfaces/IUserVerification.js"
import { Request } from "express"
import { sendEmail } from "../../utils/sendEmail.js"
import { responseCodes } from "../../utils/responseCodes.js"
import { isUserVerified } from "../../utils/isUserVerified.js"
import { deriveKey } from "../../utils/crypto/pbkdf2.js"
import { pwdChangeSchema } from "../../middlewares/validators/schemas/pwdChangeSchema.js"

const MODULE = "services :: user_services :: pwdChange"

export async function pwdChange(req: Request<IUserPwdChange>): Promise<ServiceResponse<IUserPwdChange>> {
    const reqData: IUserPwdChange = {
        otp: req.body.otp,
        newPwd: req.body.newPwd,
    }

    const vRes = await validateRequest<IUserPwdChange>(MODULE, reqData, pwdChangeSchema)
    if (!vRes.isValid) {
        logger(MODULE, `Pwd change req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: vRes.statusCode,
        }
    }

    if (!req.user) {
        const err = "User not found"
        logger(MODULE, `User not found, aborting.`, LogType.WARN)
        return {
            err: true,
            errMsg: err,
            statusCode: responseCodes.NOT_FOUND
        }
    }

    const userVerified = isUserVerified(req.user)
    if (!userVerified) {
        logger(MODULE, `Failed to change account pwd - user account is unverified`, LogType.WARN)
        return {
            err: true,
            errMsg: `Only verified accounts can perform this action.`,
            statusCode: responseCodes.UNAUTHORIZED,
        }
    }

    // Check if no OTP provided or OTP is expired
    if (!req.user.pwdChangeOTP || !req.user.pwdChangeOTPExpires || new Date() >= req.user.pwdChangeOTPExpires) {
        return {
            err: true,
            errMsg: `Your email change OTP code expired.`,
            statusCode: responseCodes.BAD_REQUEST,
        }
    }

    // Check if password is different from the current one
    const saltedNewPwd = reqData.newPwd + req.user.salt
    const hashedNewPwd = deriveKey({ password: saltedNewPwd, salt: req.user.salt })
    if (hashedNewPwd === req.user.password) {
        return {
            err: true,
            errMsg: `New password must be different from the current one.`,
            statusCode: responseCodes.CONFLICT
        }
    }

    if (reqData.otp !== req.user.pwdChangeOTP) {
        return {
            err: true,
            errMsg: `Invalid OTP code.`,
            statusCode: responseCodes.UNAUTHORIZED,
        }
    }

    try {
        const emailRes = await sendEmail(
            req.user.email,
            `Account password changed`,
            `You just changed your Skojir account password. If this wasn't you, please contact support immediately.`
        )
        if (emailRes.err) {
            return {
                err: true,
                errMsg: "Internal error",
                statusCode: responseCodes.INTERNAL_SERVER_ERROR
            }
        }

        await User.updateOne(
            { email: reqData.email },
            {
                $set: {
                    email: reqData.email,
                },
                $unset: {
                    pwdChangeOTP: "",
                    pwdChangeOTPExpires: "",
                },
            },
        )
    } catch (err) {
        const dbErr = (err as Error).message
        logger(MODULE, dbErr, LogType.WARN)
        return {
            err: true,
            errMsg: `Internal database error.`,
            statusCode: responseCodes.INTERNAL_SERVER_ERROR,
        }
    }

    return {
        err: false,
        data: reqData,
        statusCode: responseCodes.SUCCESS,
    }
}
