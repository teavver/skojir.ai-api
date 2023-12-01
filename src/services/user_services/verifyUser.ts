import { User } from "../../models/User.js";
import { logger, LogType } from "../../utils/logger.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { validateVerifyUserRequest } from "../../middlewares/validators/user_services/verifyUser.js";
import IUserVerification from "../../types/interfaces/IUserVerification.js";
import { generateAuthToken } from "../../middlewares/auth/genToken.js";
import { IUserUnverified } from "../../types/interfaces/IUserUnverified.js";
import { IUserVerified } from "../../types/interfaces/IUserVerified.js";

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
            errMsg: vRes.error
        }
    }

    const user = await User.findOne({ email: reqData.email }) as IUserUnverified
    if (!user) {
        return {
            err: true,
            errMsg: `User does not exist.`
        }
    }

    if (user.isEmailVerified) {
        return {
            err: true,
            errMsg: `Account is already verified.`
        }
    }

    if (user.verificationCode !== reqData.verificationCode) {
        return {
            err: true,
            errMsg: 'Invalid verification code.'
        }
    }

    if (new Date() >= user.verificationCodeExpires) {
        return {
            err: true,
            errMsg: 'Verification code expired.'
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
            errMsg: `Internal database error.`
        }
    }

    logger(MODULE, `User ${user.email} verified their account`)
    return {
        err: false,
        data: user
    } 
}