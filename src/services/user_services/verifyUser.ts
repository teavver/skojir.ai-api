import { User } from "../../models/User.js";
import { logger, LogType } from "../../utils/logger.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { validateVerifyUserRequest } from "../../middlewares/validators/user_services/verifyUser.js";
import IUserVerification from "../../types/interfaces/IUserVerification.js";
import { IUserUnverified } from "../../types/interfaces/IUserUnverified.js";
import { generateVerificationCode } from "../../utils/crypto/genVerificationCode.js";
import { sendVerificationCodeEmail } from "./sendVerificationCodeEmail.js";
import { generateExpiryDate } from "../../utils/genExpiryDate.js";

const MODULE = "services :: user_services :: verifyUser"

/**
 * Validates verify request from user, checks if account exists
 * Checks if verification code and expiry dates are valid
 * If everything is fine, verifies the User and generates authTokens for them
 */
export async function verifyUser(reqData: IUserVerification): Promise<ServiceResponse> {

    const vRes = await validateVerifyUserRequest(reqData)
    if (!vRes.isValid) {
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: 400,
        }
    }

    const user = await User.findOne({ email: reqData.email }) as IUserUnverified
    if (!user) {
        return {
            err: true,
            errMsg: `User does not exist.`,
            statusCode: 404,
        }
    }

    if (user.isEmailVerified) {
        return {
            err: true,
            errMsg: `Account is already verified.`,
            statusCode: 409
        }
    }

    // re-send case
    if (reqData.resend) {

        const newCode = generateVerificationCode()
        const newExpDate = generateExpiryDate()
        
        try {

            await User.updateOne({ email: user.email }, {
                $set: {
                    verificationCode: newCode,
                    verificationCodeExpires: newExpDate
                }
            })
            
            const emailRes = await sendVerificationCodeEmail(user.email, newCode)
            if (emailRes.err) {
                return {
                    err: true,
                    errMsg: emailRes.errMsg,
                    statusCode: emailRes.statusCode
                }
            }

            logger(MODULE, `Re-sending verification code for: ${user.email}`)

            return {
                err: false,
                data: `A new verification code was sent. Please check the email associated with your account`,
                statusCode: 200
            } 

        } catch (err) {
            const errMsg = (err as Error).message
            logger(MODULE, `Resend verification code case failed. Err: ${errMsg}`, LogType.WARN)
            return {
                err: true,
                errMsg: errMsg,
                statusCode: 500
            }
        }
    }

    if (user.verificationCode !== reqData.verificationCode) {
        return {
            err: true,
            errMsg: 'Invalid verification code.',
            statusCode: 400
        }
    }

    if (new Date() >= user.verificationCodeExpires) {
        return {
            err: true,
            errMsg: 'Verification code expired.',
            statusCode: 400
        }
    }

    try {

        // User becomes verified
        await User.updateOne({ email: user.email }, {
            $set: {
                isEmailVerified: true,
            },
            $unset: {
                verificationCode: "",
                verificationCodeExpires: "",
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

    logger(MODULE, `User ${user.email} verified their account`)
    return {
        err: false,
        data: `User account verified`,
        statusCode: 200
    } 
}