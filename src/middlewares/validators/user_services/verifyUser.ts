import Joi from "joi";
import { VerifyRequest } from "../../../types/requests/client/VerifyRequest.js";
import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";

/**
 * Validates verify request with schema
 */

const MODULE = "middlewares :: validators :: user_services :: verifyUser"

export const validateVerifyUserRequest = async (req: VerifyRequest): Promise<ValidatorResponse> => {

    try {

        // validate with schema
        const data: VerifyRequest = await verifyUserSchema.validateAsync(req)

        return {
            isValid: true,
            data: data 
        }

    } catch (err) {
        const errMsg = (err as Error).message
        logger(MODULE, errMsg, LogType.WARN)

        return {
            isValid: false,
            error: errMsg
        }
    }
}

const verifyUserSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: true } })
        .min(6)
        .max(254)
        .required(),
    
    code: Joi.string()
        .length(6)
        .required()
})