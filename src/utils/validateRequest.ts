import { logger, LogType } from "./logger.js";
import { ValidatorResponse } from "../types/responses/ValidatorResponse.js";
import { Schema } from "joi";

export async function validateRequest<T>(
    module: string,
    reqData: T,
    schema: Schema,
): Promise<ValidatorResponse<T>> {
    try {
        const vRes = await schema.validateAsync(reqData)
        logger(module, `Request data validated.`)
        return {
            isValid: true,
            data: vRes
        }
    } catch (err) {
        logger(module, `Validation failed. Error: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: `Invalid data`,
            statusCode: 400
        }
    }
}