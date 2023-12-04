import { User } from "../../models/User.js";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { logger, LogType } from "../../utils/logger.js";
import { validateDeleteUserRequest } from "../../middlewares/validators/user_services/deleteUser.js";
import { deriveKey } from "../../utils/crypto/pbkdf2.js";
import { IUserVerified } from "../../types/interfaces/IUserVerified.js";

const MODULE = "services :: user_services :: deleteUser"

export async function deleteUser(userCredentials: IUserCredentials): Promise<ServiceResponse> {
 
    const vRes = await validateDeleteUserRequest(userCredentials)
    if (!vRes.isValid) {
        logger(MODULE, `deleteUser req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: 400
        }
    }

    // check if user exists
    const user = await User.findOne({ email: userCredentials.email })
    if (!user) {
        logger(MODULE, `Failed to delete account - user does not exist`, LogType.WARN)
        return {
            err: true,
            errMsg: `Sorry, we couldn't find your account.`,
            statusCode: 404
        }
    }

    // check if password is correct
    const userPwdSalted = userCredentials.password + user.salt
    const hashedPwd = deriveKey({ password: userPwdSalted, salt: user.salt })
    if (hashedPwd !== user.password) {
        logger(MODULE, `Failed to delete account - incorrect password input`, LogType.WARN)
        return {
            err: true,
            errMsg: `Failed to delete account - incorrect password.`,
            statusCode: 401
        }
    }

    return {
        err: false,
        data: user as IUserVerified,
        statusCode: 200
    }

}