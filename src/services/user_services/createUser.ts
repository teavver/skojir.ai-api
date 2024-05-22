import { Request } from "express"
import { User } from "../../models/User.js"
import { IUserCredentials } from "../../types/interfaces/IUserCredentials.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { logger, LogType } from "../../utils/logger.js"
import { generateExpiryDate } from "../../utils/genExpiryDate.js"
import { generateSalt } from "../../utils/crypto/salt.js"
import { deriveKey } from "../../utils/crypto/pbkdf2.js"
import { validateRequest } from "../../utils/validateRequest.js"
import { userCredentialsSchema } from "../../middlewares/validators/schemas/userCredentialsSchema.js"
import { generateOTP } from "../../utils/crypto/genOTP.js"
import { sendEmail } from "../../utils/sendEmail.js"
import { responseCodes } from "../../utils/responseCodes.js"

const MODULE = "services :: user_services :: createUser"

export async function createUser(req: Request<IUserCredentials>): Promise<ServiceResponse<IUserCredentials>> {
    const userCredentials: IUserCredentials = {
        email: req.body.email,
        password: req.body.password,
    }

    const vRes = await validateRequest<IUserCredentials>(MODULE, userCredentials, userCredentialsSchema)
    if (!vRes.isValid) {
        logger(MODULE, `createUser req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: vRes.statusCode,
        }
    }

    const user = await User.findOne({ email: userCredentials.email })
    if (user) {
        logger(MODULE, `Failed to create new user. Reason: user already has an account`, LogType.WARN)
        return {
            err: true,
            errMsg: `An account with this email address already exists.
                If this is your email address, please try logging in instead.
                If you've forgotten your password, you can reset it using the "Forgot Password" button.
                `,
            statusCode: responseCodes.CONFLICT,
        }
    }

    const salt = generateSalt()
    const verCode = generateOTP()
    const saltedPwd = userCredentials.password + salt
    const hashedPwd = deriveKey({ password: saltedPwd, salt: salt })

    const newUser = new User({
        email: userCredentials.email,
        password: hashedPwd,
        salt: salt,
        emailOTP: verCode,
        emailOTPExpires: generateExpiryDate(), // 10 minutes by default
    })

    try {
        const emailRes = await sendEmail(
            userCredentials.email,
            `Welcome to skojir!`,
            `Use this code to activate your account: ${verCode}`,
        )
        if (emailRes.err) {
            return {
                err: true,
                errMsg: "Internal error",
                statusCode: responseCodes.INTERNAL_SERVER_ERROR,
            }
        }

        await newUser.save()
    } catch (err) {
        const dbErr = (err as Error).message
        logger(MODULE, dbErr, LogType.WARN)
        return {
            err: true,
            errMsg: `createUser req rejected: Error while updating db`,
            statusCode: responseCodes.INTERNAL_SERVER_ERROR,
        }
    }

    return {
        err: false,
        data: userCredentials,
        statusCode: responseCodes.CREATED,
    }
}
