import IUserVerification from "../../../types/interfaces/IUserVerification.js";
import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import { verificationSchema } from "../schemas/verificationSchema.js";

const MODULE = "middlewares :: validators :: user_services :: verifyUser"

export const validateVerifyUserRequest = async (reqBody:any): Promise<ValidatorResponse> => {
    try {
        const vRes: IUserVerification = await verificationSchema.validateAsync(reqBody)
        logger(MODULE, `Validated verifyUser req body`)
        return {
            isValid: true,
            data: vRes 
        }
    } catch (err) {
        logger(MODULE, `Couldn't validate verifyUser req body: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: `Invalid request data`,
            statusCode: 400
        }
    }
}