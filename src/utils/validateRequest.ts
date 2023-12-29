import { logger, LogType } from "./logger.js";
import { ValidatorResponse } from "../types/responses/ValidatorResponse.js";
import { Schema } from "joi";

export async function validateRequest<T>(
    module: string,
    reqBody: any,
    schema: Schema,
): Promise<ValidatorResponse<T>> {
    try {
        const vRes = await schema.validateAsync(reqBody)
        logger(module, `Request data validated.`)
        return {
            isValid: true,
            data: vRes
        }
    } catch (err) {
        logger(module, `Validation failed. Error: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }
}