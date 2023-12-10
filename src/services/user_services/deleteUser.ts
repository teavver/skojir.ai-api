import { User } from "../../models/User.js";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { logger, LogType } from "../../utils/logger.js";
import { validateDeleteUserRequest } from "../../middlewares/validators/user_services/deleteUser.js";
import { deriveKey } from "../../utils/crypto/pbkdf2.js";

const MODULE = "services :: user_services :: deleteUser"

export async function deleteUser(reqBody:any): Promise<ServiceResponse<IUserCredentials>> {
 
    const vRes = await validateDeleteUserRequest(reqBody)
    if (!vRes.isValid) {
        logger(MODULE, `deleteUser req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: 400
        }
    }

    const vData = vRes.data as IUserCredentials
    const user = await User.findOne({ email: vData.email })
    if (!user) {
        logger(MODULE, `Failed to delete account - user does not exist`, LogType.WARN)
        return {
            err: true,
            errMsg: `Sorry, we couldn't find your account.`,
            statusCode: 404
        }
    }

    const userPwdSalted = vData.password + user.salt
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
        data: vData,
        statusCode: 200
    }

}