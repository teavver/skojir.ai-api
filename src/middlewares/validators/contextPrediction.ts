import Joi from "joi"
import { PredictionRequest } from "../../types/requests/PredictionRequest.js"
import { logger, LogType } from "../../utils/logger.js"
import { ValidatorResponse } from "../../types/responses/ValidatorResponse.js"

const MODULE = "middlewares :: validators :: contextPrediction"

export const validateContextPredictionRequest = async (req: PredictionRequest): Promise<ValidatorResponse> => {
    try {
        const data = await predictionRequestSchema.validateAsync(req)
        logger(MODULE, `Validated prediction req data`)
        return {
            isValid: true,
            data: data
        }
    } catch (err) {
        logger(MODULE, `Could not validate prediction req data: ${err}`, LogType.ERR)
        return {
            isValid: false,
            error: (err as Error).message,
            statusCode: 400
        }
    }
}

const predictionRequestSchema = Joi.object({
    threshold: Joi.number()
        .min(0.10)
        .max(0.50)
        .required(),
        
    img: Joi.string()
        .min(10)
        .max(2500000) // ~2.5MB string
        .required()
})