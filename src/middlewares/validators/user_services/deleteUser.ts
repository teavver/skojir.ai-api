import { logger, LogType } from "../../../utils/logger.js";
import IUserCredentials from "../../../types/interfaces/IUserCredentials.js";
import { ValidatorResponse } from "../../../types/responses/ValidatorResponse.js";
import { authUserCredentialsSchema } from "../schemas/auth/authUserCredentialsSchema.js";

const MODULE = "middlewares :: validators :: user_services :: deleteUser"

export const validateDeleteUserRequest = async (reqBody:any): Promise<ValidatorResponse> => {
    try {
        const vRes = await authUserCredentialsSchema.validateAsync(reqBody)
        const { user, ...data } = vRes
        const userData: IUserCredentials = data as IUserCredentials
        logger(MODULE, `Validated deleteUser req body`)
        return {
            isValid: true,
            data: userData
        }

    } catch (err) {
        logger(MODULE, `Couldn't validate deleteUser req body: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }
}