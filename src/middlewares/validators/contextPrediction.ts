import Joi from "joi"
import { PredictionRequest } from "../../types/requests/PredictionRequest.js"
import { logger, LogType } from "../../utils/logger.js"

const MODULE = "middlewares :: validators :: contextPrediction"

export const validateContextPredictionRequest = async (req: PredictionRequest): Promise<[boolean, Object]> => {
    try {
        const value = await predictionRequestSchema.validateAsync(req)
        logger(MODULE, `Validated prediction req data`)
        return [true, value]
    } catch (err) {
        logger(MODULE, `Could not validate prediction req data: ${err}`, LogType.ERR)
        return [false, { error: err }]
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