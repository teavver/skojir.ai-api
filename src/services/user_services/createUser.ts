import { Request } from "express";
import { User } from "../../models/User.js";
import { IUserCredentials } from "../../types/express/interfaces/IUserCredentials.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { logger, LogType } from "../../utils/logger.js";
import { generateExpiryDate } from "../../utils/genExpiryDate.js";
import { generateSalt } from "../../utils/crypto/salt.js";
import { deriveKey } from "../../utils/crypto/pbkdf2.js";
import { validateRequest } from "../../utils/validateRequest.js";
import { userCredentialsSchema } from "../../middlewares/validators/schemas/userCredentialsSchema.js";

const MODULE = "services :: user_services :: createUser"

export async function createUser(req:Request<IUserCredentials>, verificationCode: string): Promise<ServiceResponse<IUserCredentials>> {

    const userCredentials: IUserCredentials = {
        email: req.body.email,
        password: req.body.password
    }

    const vRes = await validateRequest<IUserCredentials>(MODULE, userCredentials, userCredentialsSchema)
    if (!vRes.isValid) {
        logger(MODULE, `createUser req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: vRes.statusCode
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
            statusCode: 409
        }
    }

    const salt = generateSalt()
    const saltedPwd = userCredentials.password + salt
    const hashedPwd = deriveKey({ password: saltedPwd, salt: salt })
    
    const newUser = new User({
        email: userCredentials.email,
        password: hashedPwd,
        salt: salt,
        verificationCode: verificationCode,
        verificationCodeExpires: generateExpiryDate() // 10 minutes by default
    })

    try {
        await newUser.save()
    } catch (err) {
        const dbErr = (err as Error).message
        logger(MODULE, dbErr, LogType.WARN)
        return {
            err: true,
            errMsg: `createUser req rejected: Error while updating db`,
            statusCode: 500
        }
    }

    return {
        err: false,
        data: userCredentials,
        statusCode: 201
    }
}