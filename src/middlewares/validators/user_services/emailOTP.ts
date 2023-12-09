import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import { emailSchema } from "../schemas/emailSchema.js";
import IUserBase from "../../../types/interfaces/IUserBase.js";

const MODULE = "middlewares :: validators :: emailOTP"

export const validateEmailOTP = async (userData: IUserBase): Promise<ValidatorResponse> => {
    try {
        const data = await emailSchema.validateAsync(userData.email)
        logger(MODULE, `Validated email OTP req data`)
        return {
            isValid: true,
            data: data
        }
    } catch (err) {
        logger(MODULE, `Could not validate email OTP req data: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }
}