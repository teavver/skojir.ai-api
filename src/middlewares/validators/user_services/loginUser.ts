import { logger, LogType } from "../../../utils/logger.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import IUserCredentials from "../../../types/interfaces/IUserCredentials.js";
import { userCredentialsSchema } from "../schemas/userCredentialsSchema.js";

const MODULE = "middlewares :: validators :: user_services :: loginUser"

export const validateLoginUserRequest = async (reqBody:any): Promise<ValidatorResponse> => {
    try {
        const vRes: IUserCredentials = await userCredentialsSchema.validateAsync(reqBody)
        logger(MODULE, `Validated login req body`)
        return {
            isValid: true,
            data: vRes
        }

    } catch (err) {
        logger(MODULE, `Couldn't validate login req body: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }

}