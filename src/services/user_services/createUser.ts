import { RegisterRequest } from "../../types/requests/client/RegisterRequest.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { hashPwd } from "../../utils/hashPwd.js";
import { logger, LogType } from "../../utils/logger.js";
import { User } from "../../models/User.js";
import { validateRegisterUserRequest } from "../../middlewares/validators/user_services/registerUser.js";
import { generateExpiryDate } from "../../utils/generateExpiryDate.js";

const MODULE = "services :: user_services :: createUser"

/**
 * Validates userData with the schema, checks for duplicates
 * Once verified, creates a new user in the database
 */ 
export async function createUser(userData: RegisterRequest, verificationCode: string): Promise<ServiceResponse> {

    const vRes = await validateRegisterUserRequest(userData)

    if (!vRes.isValid) {
        logger(MODULE, `createUser req rejected.`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
        }
    }
    
    const newUser = new User({
        email: userData.email,
        password: hashPwd(userData.password),
        verificationCode: verificationCode,
        verificationCodeExpires: generateExpiryDate()
    })

    try {
        await newUser.save()
    } catch (err) {
        const dbErr = (err as Error).message
        logger(MODULE, dbErr, LogType.WARN)
        return {
            err: true,
            errMsg: `Internal database error.`
        }
    }


    return {
        err: false,
        data: "User created"
    }
}