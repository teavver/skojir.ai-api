import IUserVerification from "../../../types/interfaces/IUserVerification.js";
import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import { verifyUserSchema } from "../schemas/verifySchema.js";

/**
 * Validates verify request with schema
 */

const MODULE = "middlewares :: validators :: user_services :: verifyUser"

export const validateVerifyUserRequest = async (req: IUserVerification): Promise<ValidatorResponse> => {

    try {

        // validate with schema
        const data: IUserVerification = await verifyUserSchema.validateAsync(req)

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