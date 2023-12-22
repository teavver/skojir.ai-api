import { PredictionRequest } from "../../types/requests/PredictionRequest.js"
import { logger, LogType } from "../../utils/logger.js"
import { predictionRequestSchema } from "./schemas/predictionRequestSchema.js"
import { ValidatorResponse } from "../../types/responses/ValidatorResponse.js"

const MODULE = "middlewares :: validators :: contextPrediction"

export const validateContextPredictionRequest = async (reqBody:any): Promise<ValidatorResponse<PredictionRequest>> => {
    try {
        const vRes: PredictionRequest = await predictionRequestSchema.validateAsync(reqBody)
        logger(MODULE, `Validated prediction req body`)
        return {
            isValid: true,
            data: vRes
        }
    } catch (err) {
        logger(MODULE, `Couldn't validate prediction req body: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }
}
