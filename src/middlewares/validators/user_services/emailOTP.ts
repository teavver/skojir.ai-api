import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import IUserBase from "../../../types/interfaces/IUserBase.js";
import { authUserBaseSchema } from "../schemas/auth/authUserBaseSchema.js";

const MODULE = "middlewares :: validators :: emailOTP"

export const validateEmailOTP = async (reqBody:any): Promise<ValidatorResponse> => {
    try {
        const vRes: IUserBase = await authUserBaseSchema.validateAsync(reqBody)
        logger(MODULE, `Validated email OTP req body`)
        return {
            isValid: true,
            data: vRes
        }
    } catch (err) {
        logger(MODULE, `Couldn't validate email OTP req body: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }
}