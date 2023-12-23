import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import IUserVerification from "../../../types/interfaces/IUserVerification.js";
import { AuthEmailChangeRequestResult } from "../schemas/auth/authVerificationSchema.js";
import { authEmailChangeSchema } from "../schemas/auth/authVerificationSchema.js";

const MODULE = "middlewares :: validators :: emailChange"

export const validateEmailChange = async (reqBody:any): Promise<ValidatorResponse<IUserVerification>> => {
    try {
        const vRes: AuthEmailChangeRequestResult = await authEmailChangeSchema.validateAsync(reqBody)
        const { user, ...verificationData } = vRes
        logger(MODULE, `Validated email change req body`)
        return {
            isValid: true,
            data: verificationData
        }
    } catch (err) {
        logger(MODULE, `Couldn't validate email change req body: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }
}