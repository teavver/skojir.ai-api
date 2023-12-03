import { logger, LogType } from "../../../utils/logger.js";
import IUserCredentials from "../../../types/interfaces/IUserCredentials.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import { User } from "../../../models/User.js";
import { userCredentialsSchema } from "../schemas/userCredentialsSchema.js";

const MODULE = "middlewares :: validators :: user_services :: createUser"

/**
 * Validates register user input with schema and checks if user has an account already
 */
export const validateRegisterUserRequest = async (req: IUserCredentials): Promise<ValidatorResponse> => {

    try {

        // validate with schema
        const data: IUserCredentials = await userCredentialsSchema.validateAsync(req)

        // check if user exists already
        const user = await User.findOne({ email: req.email })
        if (user) {
            logger(MODULE, `Failed to create new user. Reason: user already has an account`, LogType.WARN)
            return {
                isValid: false,
                error: `An account with this email address already exists.
                    If this is your email address, please try logging in instead.
                    If you've forgotten your password, you can reset it using the "Forgot Password" button.
                    `,
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