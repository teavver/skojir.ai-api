import { CreateAccountRequest } from "../../types/requests/CreateAccountReuqest.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { hashPwd } from "../../utils/hashPwd.js";
import { logger, LogType } from "../../utils/logger.js";
import { User } from "../../models/User.js";
import { validateCreateUserRequest } from "../../middlewares/validators/user_services/createUser.js";
import { generateVerificationCode } from "./generateVerificationCode.js";
import { generateExpiryDate } from "./generateExpiryDate.js";
import { sendVerificationCodeEmail } from "./sendVerificationCodeEmail.js";

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

    // check for duplicates (MOVE THIS PART TO CONTROLLER)
    const user = await User.findOne({ email: userData.email })
    if (user) {
        logger(MODULE, `createUser req rejected - duplicate`, LogType.WARN)
        return {
            err: true,
            errMsg: `Registration failed: user e-mail exists already`,
        }
    }

    const verificationCode = generateVerificationCode()
    const emailRes = await sendVerificationCodeEmail(userData.email, verificationCode)
    if (emailRes.err) {
        return {
            err: true,
            errMsg: emailRes.errMsg
        }
    }

    const newUser = new User({
        email: userData.email,
        password: hashPwd(userData.password),
        verificationCode: verificationCode,
        verificationCodeExpires: generateExpiryDate()
        // ^^^^ FIXME: integrate a full service for this
        // (send email to user, add expiry date to the ver code in db)
        // MOVE ALL OF THE ABOVE TO CONTROLLER. THIS FILE SHOULD RECEIVE THE OBJECT ABOVE AND ONLY PUT IT TO DB
    })

    logger(MODULE, `New user created: e-mail: ${newUser.email}, code: ${newUser.verificationCode}`)
    await newUser.save()

    return {
        err: false,
        data: "User created"
    }
}