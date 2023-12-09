
import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import IUserVerification from "../../../types/interfaces/IUserVerification.js";
import { verifyUserSchema } from "../schemas/verifySchema.js";

const MODULE = "middlewares :: validators :: emailChange"

export const validateEmailChange = async (userData: IUserVerification): Promise<ValidatorResponse> => {
    try {
        const data = await verifyUserSchema.validateAsync(userData.email)
        logger(MODULE, `Validated email change req data`)
        return {
            isValid: true,
            data: data
        }
    } catch (err) {
        logger(MODULE, `Could not validate email change req data: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }
}