import { Request } from "express";
import { IUserCredentials } from "../../types/interfaces/IUserCredentials.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { logger, LogType } from "../../utils/logger.js";
import { validateRequest } from "../../utils/validateRequest.js";
import { deriveKey } from "../../utils/crypto/pbkdf2.js";
import { IUserPassword } from "../../types/interfaces/IUserPassword.js";
import { IUserVerified } from "../../types/interfaces/IUserVerified.js";
import { passwordSchema } from "../../middlewares/validators/schemas/passwordSchema.js";
import { IUserBase } from "../../types/interfaces/IUserBase.js";

const MODULE = "services :: user_services :: deleteUser"

export async function deleteUser(req:Request<IUserPassword>): Promise<ServiceResponse<IUserBase>> {

    const userData: IUserVerified = req.user!
    const userInputPwd: IUserPassword = req.body.password
    const vRes = await validateRequest<IUserCredentials>(MODULE, userInputPwd, passwordSchema)
    if (!vRes.isValid) {
        logger(MODULE, `deleteUser req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: vRes.statusCode
        }
    }

    if (!userData.email) {
        logger(MODULE, `Failed to delete account - user does not exist`, LogType.WARN)
        return {
            err: true,
            errMsg: `Sorry, we couldn't find your account.`,
            statusCode: 404
        }
    }

    const userPwdSalted = userInputPwd + userData.salt
    const hashedPwd = deriveKey({ password: userPwdSalted, salt: userData.salt })
    if (hashedPwd !== userData.password) {
        logger(MODULE, `Failed to delete account - incorrect password input`, LogType.WARN)
        return {
            err: true,
            errMsg: `Failed to delete account - incorrect password.`,
            statusCode: 401
        }
    }

    return {
        err: false,
        data: { email: userData.email },
        statusCode: 200
    }

}