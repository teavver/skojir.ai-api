import Joi from "joi";
import { CreateAccountRequest } from "../../../types/requests/CreateAccountReuqest.js";
import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";

const MODULE = "middlewares :: validators :: user_services :: createUser"

export const validateCreateUserRequest = async (req: CreateAccountRequest): Promise<ValidatorResponse> => {
    try {
        const data = await createUserSchema.validateAsync(req)
        logger(MODULE, `Validated createUser req data`)
        return {
            isValid: true,
            data: data
        }
    } catch (err) {
        logger(MODULE, `Could not validate createUser req data: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message
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
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required()
})