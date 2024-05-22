import { User } from "../../models/User.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { logger, LogType } from "../../utils/logger.js"
import { validateRequest } from "../../utils/validateRequest.js"
import { IUserVerification } from "../../types/interfaces/IUserVerification.js"
import { Request } from "express"
import { verificationSchema } from "../../middlewares/validators/schemas/verificationSchema.js"
import { sendEmail } from "../../utils/sendEmail.js"
import { responseCodes } from "../../utils/responseCodes.js"
import { isUserVerified } from "../../utils/isUserVerified.js"

const MODULE = "services :: user_services :: emailChange"

export async function emailChange(req: Request<IUserVerification>): Promise<ServiceResponse<IUserVerification>> {
    const reqData: IUserVerification = {
        email: req.body.email,
        otp: req.body.otp,
    }

    const vRes = await validateRequest<IUserVerification>(MODULE, reqData, verificationSchema)
    if (!vRes.isValid) {
        logger(MODULE, `Email change req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
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
            statusCode: responseCodes.NOT_FOUND,
        }
    }

    const userVerified = isUserVerified(req.user)
    if (!userVerified) {
        logger(MODULE, `Failed to change account email - user account is unverified`, LogType.WARN)
        return {
            err: true,
            errMsg: `Only verified accounts can perform this action.`,
            statusCode: responseCodes.UNAUTHORIZED,
        }
    }

    // Check if user is trying to change their email to an already existing account
    const targetEmailUser = await User.findOne({ email: reqData.email })
    if (targetEmailUser) {
        const msg = `There's already an account with that email account.`
        logger(MODULE, msg, LogType.WARN)
        return {
            err: true,
            errMsg: msg,
            statusCode: responseCodes.CONFLICT,
        }
    }

    // Check if no OTP provided or OTP is expired
    if (!req.user.emailOTP || !req.user.emailOTPExpires || new Date() >= req.user.emailOTPExpires) {
        return {
            err: true,
            errMsg: `Your email change OTP code expired.`,
            statusCode: responseCodes.BAD_REQUEST,
        }
    }

    if (reqData.otp !== req.user.emailOTP) {
        return {
            err: true,
            errMsg: `Invalid OTP code.`,
            statusCode: responseCodes.UNAUTHORIZED,
        }
    }

    try {
        const emailRes = await sendEmail(
            req.user.email,
            `Account email changed`,
            `You just changed your Skojir account email address. New address: '${reqData.email}'. If this wasn't you, please contact support immediately.`,
        )
        if (emailRes.err) {
            return {
                err: true,
                errMsg: "Internal error",
                statusCode: responseCodes.INTERNAL_SERVER_ERROR,
            }
        }

        await User.updateOne(
            { email: reqData.email },
            {
                $set: {
                    email: reqData.email,
                },
                $unset: {
                    emailOTP: "",
                    emailOTPExpires: "",
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
