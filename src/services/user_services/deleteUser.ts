import { User } from "../../models/User.js";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { logger, LogType } from "../../utils/logger.js";
import { validateRequest } from "../../utils/validateRequest.js";
import { deriveKey } from "../../utils/crypto/pbkdf2.js";
import { authUserCredentialsSchema, AuthUserCredentialsSchemaResult } from "../../middlewares/validators/schemas/auth/authUserCredentialsSchema.js";

const MODULE = "services :: user_services :: deleteUser"

export async function deleteUser(reqBody:any): Promise<ServiceResponse<IUserCredentials>> {
 
    const vRes = await validateRequest<AuthUserCredentialsSchemaResult>(MODULE, reqBody, authUserCredentialsSchema)
    if (!vRes.isValid) {
        logger(MODULE, `deleteUser req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: vRes.statusCode
        }
    }

    const reqData: IUserCredentials = vRes.data
    const user = await User.findOne({ email: reqData.email })
    if (!user) {
        logger(MODULE, `Failed to delete account - user does not exist`, LogType.WARN)
        return {
            err: true,
            errMsg: `Sorry, we couldn't find your account.`,
            statusCode: 404
        }
    }

    const userPwdSalted = reqData.password + user.salt
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
        data: reqData,
        statusCode: 200
    }

}