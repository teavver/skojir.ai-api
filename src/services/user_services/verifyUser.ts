import { User } from "../../models/User.js";
import { logger, LogType } from "../../utils/logger.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { validateVerifyUserRequest } from "../../middlewares/validators/user_services/verifyUser.js";
import { VerifyRequest } from "../../types/requests/client/VerifyRequest.js";

const MODULE = "services :: user_services :: verifyUser"

/**
 * Validates verify request from user, checks if account exists
 * Checks if verification code and expiry dates are valid
 */
export async function verifyUser(reqData: VerifyRequest): Promise<ServiceResponse> {

    const vRes = await validateVerifyUserRequest(reqData)
    if (!vRes.isValid) {
        return {
            err: true,
            errMsg: vRes.error
        }
    }

    const user = await User.findOne({ email: reqData.email })
    if (!user) {
        return {
            err: true,
            errMsg: `User does not exist.`
        }
    }

    if (user.verificationCode !== reqData.code) {
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

    if (user.isEmailVerified) {
        return {
            err: true,
            errMsg: `Account is already verified.`
        }
    }

    try {
        const dbRes = await User.updateOne({ email: user.email }, {
            $set: { isEmailVerified: true }
        })

        if (!dbRes.acknowledged || dbRes.modifiedCount !== 1) {
            return {
                err: true,
                errMsg: `Database update error.`
            }
        }

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
        data: "Account verified."
    } 
}