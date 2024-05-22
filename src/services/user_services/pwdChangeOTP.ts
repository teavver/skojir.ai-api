import { User } from "../../models/User.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { logger, LogType } from "../../utils/logger.js"
import { IUserBase } from "../../types/interfaces/IUserBase.js"
import { generateOTP } from "../../utils/crypto/genOTP.js"
import { sendEmail } from "../../utils/sendEmail.js"
import { generateExpiryDate } from "../../utils/genExpiryDate.js"
import { Request } from "express"
import { IUserVerified } from "../../types/interfaces/IUserVerified.js"
import { responseCodes } from "../../utils/responseCodes.js"

const MODULE = "services :: user_services :: pwdChangeOTP"

export async function pwdChangeOTP(req: Request): Promise<ServiceResponse<IUserBase>> {
    const userData: IUserVerified = req.user as IUserVerified
    if (!userData.email) {
        logger(MODULE, `Failed to send pwd change OTP - user does not exist`, LogType.WARN)
        return {
            err: true,
            errMsg: `Sorry, we couldn't find your account.`,
            statusCode: responseCodes.NOT_FOUND,
        }
    }

    if (!userData.isEmailVerified) {
        logger(MODULE, `Failed to send pwd change OTP - account is not verified`, LogType.WARN)
        return {
            err: true,
            errMsg: `Your account must be verified to perform this action.`,
            statusCode: responseCodes.UNAUTHORIZED,
        }
    }

    if (userData.pwdChangeOTP || (userData.pwdChangeOTPExpires && new Date() >= userData.pwdChangeOTPExpires)) {
        return {
            err: true,
            errMsg: "There is a valid OTP code already. Please wait before requesting another one.",
            statusCode: responseCodes.BAD_REQUEST,
        }
    }

    const pwdOTP = generateOTP()
    const pwdOTPExpiry = generateExpiryDate()
    const pwdChangeMsg = `Use this code to change the password associated with your Skojir account: ${pwdOTP}. The code will expire in 10 minutes.`

    try {
        await User.updateOne(
            { email: userData.email },
            {
                $set: {
                    pwdChangeOTP: pwdOTP,
                    pwdChangeOTPExpires: pwdOTPExpiry,
                },
            },
        )

        const emailRes = await sendEmail(userData.email, `Skoijir account password change`, pwdChangeMsg)
        if (emailRes.err) {
            return {
                err: true,
                errMsg: emailRes.errMsg,
                statusCode: emailRes.statusCode,
            }
        }

        logger(MODULE, `Pwd change OTP code sent to ${userData.email}, code: ${pwdOTP}`)
    } catch (err) {
        const errMsg = (err as Error).message
        logger(MODULE, `Failed to send password change OTP code to email. Err: ${errMsg}`, LogType.WARN)
        return {
            err: true,
            errMsg: errMsg,
            statusCode: responseCodes.INTERNAL_SERVER_ERROR,
        }
    }

    return {
        err: false,
        data: { email: userData.email },
        statusCode: responseCodes.SUCCESS,
    }
}
