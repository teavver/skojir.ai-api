import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import { authVerificationSchema } from "../schemas/auth/authVerificationSchema.js";
import IUserVerification from "../../../types/interfaces/IUserVerification.js";

const MODULE = "middlewares :: validators :: emailChange"

export const validateEmailChange = async (reqBody:any): Promise<ValidatorResponse<IUserVerification>> => {
    try {
        const vRes = await authVerificationSchema.validateAsync(reqBody)
        const { userVerification }: { userVerification: IUserVerification } = vRes
        logger(MODULE, `Validated email change req body`)
        return {
            isValid: true,
            data: userVerification
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