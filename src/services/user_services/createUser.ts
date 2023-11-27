import { CreateAccountRequest } from "../../types/requests/CreateAccountReuqest.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { hashPwd } from "../../utils/hashPwd.js";
import { logger, LogType } from "../../utils/logger.js";
import { User } from "../../models/User.js";
import { validateCreateUserRequest } from "../../middlewares/validators/user_services/createUser.js";
import { generateVerificationCode } from "./generateVerificationCode.js";
import { generateExpiryDate } from "./generateExpiryDate.js";

const MODULE = "services :: user_services :: createUser"

/**
 * Creates a new user and adds them to the database on success
 * Also checks for duplicates, and verifies input data
 */ 
export async function createUser(userData: CreateAccountRequest): Promise<ServiceResponse> {

    // validate user input
    const validationRes = await validateCreateUserRequest(userData)
    if (!validationRes.isValid) {
        logger(MODULE, `createUser req rejected.`, LogType.WARN)
        return {
            err: true,
            errMsg: validationRes.error,
        }
    }

    // check for duplicates
    const user = await User.findOne({ email: userData.email })
    if (user) {
        logger(MODULE, `createUser req rejected - duplicate`, LogType.WARN)
        return {
            err: true,
            errMsg: `Registration failed: user e-mail exists already`,
        }
    }

    const newUser = new User({
        email: userData.email,
        password: hashPwd(userData.password),
        verificationCode: generateVerificationCode(),
        verificationCodeExpires: generateExpiryDate()
        // ^^^^ FIXME: integrate a full service for this
        // (send email to user, add expiry date to the ver code in db)
    })

    logger(MODULE, `New user created: e-mail: ${newUser.email}, code: ${newUser.verificationCode}`)
    await newUser.save()

    return {
        err: false,
        data: "User created"
    }
}