import Joi from "joi";
import { RegisterRequest } from "../../../types/requests/client/RegisterRequest.js";
import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import { User } from "../../../models/User.js";

const MODULE = "middlewares :: validators :: user_services :: createUser"

/**
 * Validates register user input with schema and checks if user has an account already
 */
export const validateRegisterUserRequest = async (req: RegisterRequest): Promise<ValidatorResponse> => {

    try {

        // validate with schema
        const data: RegisterRequest = await createUserSchema.validateAsync(req)

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

const createUserSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: true } })
        .min(6)
        .max(254)
        .required(),
        
    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$"))
        // 8-64 characters, min 1 lowercase letter, min 1 uppercase letter, min 1 digit, min 1 special character from set {@,$,!,%,*,?,&}
        .required()
})