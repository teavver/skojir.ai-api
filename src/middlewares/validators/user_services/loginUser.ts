import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import IUserCredentials from "../../../types/interfaces/IUserCredentials.js";
import { User } from "../../../models/User.js";
import { userCredentialsSchema } from "../schemas/userCredentials.js";

const MODULE = "middlewares :: validators :: user_services :: createUser"

/**
 * Validates login user input request
 */
export const validateLoginUserRequest = async (req: IUserCredentials): Promise<ValidatorResponse> => {

    try {

        // validate with schema
        const data: IUserCredentials = await userCredentialsSchema.validateAsync(req)

        // check if user exists has an account
        const user = await User.findOne({ email: req.email })
        if (!user) {
            logger(MODULE, `Failed to login user. Reason: No account matches user email`, LogType.WARN)
            return {
                isValid: false,
                error: `
                    Sorry, we couldn't find your account.
                    Please double check your email address.
                    If you haven't created an account yet, sign up using the "Create Account" button.
                    `
            }
        }

        // only verified can log in
        if (!user.isEmailVerified) {
            logger(MODULE, `Failed to login user. Reason: Account not verified`, LogType.WARN)
            return {
                isValid: false,
                error: `
                    You need to verify your account first.
                    Check your email inbox for the verification code or click here to create a new one.
                    `
            }
        }

        return {
            isValid: true,
            data: data
        }

    } catch (err) {
        logger(MODULE, `Could not validate createUser req data: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: `Your password is not strong enough.`
        }
    }

}