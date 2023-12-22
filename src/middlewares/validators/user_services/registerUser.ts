import { logger, LogType } from "../../../utils/logger.js";
import IUserCredentials from "../../../types/interfaces/IUserCredentials.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import { userCredentialsSchema } from "../schemas/userCredentialsSchema.js";

const MODULE = "middlewares :: validators :: user_services :: createUser"

export const validateRegisterUserRequest = async (reqBody:any): Promise<ValidatorResponse<IUserCredentials>> => {
    try {
        const vRes: IUserCredentials = await userCredentialsSchema.validateAsync(reqBody)
        logger(MODULE, `Validated register req body`)
        return {
            isValid: true,
            data: vRes
        }

    } catch (err) {
        logger(MODULE, `Couldn't validate register req body: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }
}