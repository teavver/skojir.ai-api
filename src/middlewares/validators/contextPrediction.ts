import Joi from "joi"
import { PredictionRequest } from "../../types/requests/PredictionRequest.js"
import { logger, LogType } from "../../utils/logger.js"
import { ValidatorResponse } from "../../types/responses/ValidatorResponse.js"

const MODULE = "middlewares :: validators :: contextPrediction"

export const validateContextPredictionRequest = async (reqBody:any): Promise<ValidatorResponse> => {
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

const predictionRequestSchema = Joi.object<PredictionRequest>({
    img: Joi.string()
        .min(10)
        .max(2500000) // ~2.5MB string
        .required(),
    threshold: Joi.number()
        .min(0.10)
        .max(0.50)
        .required()
})