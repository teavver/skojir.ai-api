import { User } from "../../models/User.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { logger, LogType } from "../../utils/logger.js";
import { IUserBase } from "../../types/interfaces/IUserBase.js";
import { generateVerificationCode } from "../../utils/crypto/genVerificationCode.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { generateExpiryDate } from "../../utils/genExpiryDate.js";
import { Request } from "express";
import { IUserVerified } from "../../types/interfaces/IUserVerified.js";

const MODULE = "services :: user_services :: emailChangeOTP"

export async function emailChangeOTP(req:Request): Promise<ServiceResponse<IUserBase>> {

    const userData: IUserVerified = req.user!
    if (!userData.email) {
        logger(MODULE, `Failed to send email change OTP - user does not exist`, LogType.WARN)
        return {
            err: true,
            errMsg: `Sorry, we couldn't find your account.`,
            statusCode: 404
        }
    }

    if (!userData.isEmailVerified) {
        logger(MODULE, `Failed to send email change OTP - account is not verified`, LogType.WARN)
        return {
            err: true,
            errMsg: `Your account must be verified to perform this action.`,
            statusCode: 401
        }
    }

    if (userData.verificationCodeExpires && new Date() >= userData.verificationCodeExpires) {
        return {
            err: true,
            errMsg: 'There is a valid OTP code already. Please wait before requesting another one.',
            statusCode: 400
        }
    }

    const emailOTP = generateVerificationCode()
    const emailOTPExpiry = generateExpiryDate()
    const emailChangeMsg = `Use this code to change the email address connected to your account: ${emailOTP}. It will expire in 10 minutes.`

    try {
        await User.updateOne({ email: userData.email }, {
            $set: {
                verificationCode: emailOTP,
                verificationCodeExpires: emailOTPExpiry
            }
        })

        const emailRes = await sendEmail(
            userData.email,
            `Account email change`,
            emailChangeMsg
        )
        if (emailRes.err) {
            return {
                err: true,
                errMsg: emailRes.errMsg,
                statusCode: emailRes.statusCode
            }
        }

        logger(MODULE, `Email OTP code sent to ${userData.email}, code: ${emailOTP}`)

    } catch (err) {
        const errMsg = (err as Error).message
        logger(MODULE, `Send email change OTP failed. Err: ${errMsg}`, LogType.WARN)
        return {
            err: true,
            errMsg: errMsg,
            statusCode: 500
        }
    }

    return {
        err: false,
        data: { email: userData.email },
        statusCode: 200
    }
}