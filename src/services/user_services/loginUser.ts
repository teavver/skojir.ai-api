import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import IUserCredentials from "../../types/interfaces/IUserCredentials.js";
import { validateLoginUserRequest } from "../../middlewares/validators/user_services/loginUser.js";
import { deriveKey } from "../../utils/crypto/pbkdf2.js";
import { logger, LogType } from "../../utils/logger.js";
import { User } from "../../models/User.js";

const MODULE = "services :: user_services :: loginUser"

export async function loginUser(userCredentials: IUserCredentials): Promise<ServiceResponse> {

    const vRes = await validateLoginUserRequest(userCredentials)

    if (!vRes.isValid) {
        logger(MODULE, `loginUser req rejected: Failed to validate input`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
        }
    }

    // verify user password
    const user = await User.findOne({ email: userCredentials.email })
    const saltedPwd = userCredentials.password + user!.salt
    const hashedPwd = deriveKey({ password: saltedPwd, salt: user!.salt })

    if (hashedPwd !== user!.password) {
        logger(MODULE, `loginUser req rejected: Invalid password`)
        return {
            err: true,
            errMsg: `
                Incorrect password.
                If you've forgotten your password, you can reset it using the "Forgot Password" button.
                `
        }
    }

    return {
        err: false,
        data: `Login success.`
    }

}