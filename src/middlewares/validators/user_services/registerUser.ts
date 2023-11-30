import { logger, LogType } from "../../../utils/logger.js";
import { UserCredentialsRequest } from "../../../types/requests/client/UserCredentialsRequest.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import { User } from "../../../models/User.js";
import { userCredentialsSchema } from "../schemas/userCredentials.js";

const MODULE = "middlewares :: validators :: user_services :: createUser"

/**
 * Validates register user input with schema and checks if user has an account already
 */
export const validateRegisterUserRequest = async (req: UserCredentialsRequest): Promise<ValidatorResponse> => {

    try {

        // validate with schema
        const data: UserCredentialsRequest = await userCredentialsSchema.validateAsync(req)

        // check for user duplicates
        const user = await User.findOne({ email: req.email })
        if (user) {
            logger(MODULE, `Failed to create new user. Reason: duplicate`, LogType.WARN)
            return {
                isValid: false,
                error: `Registration failed: an account with this e-mail address exists already.`,
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