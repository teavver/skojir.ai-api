import Joi from "joi"
import { PredictionRequest } from "../../../models/context_extractor/prediction.js"
import { logger, LogType } from "../../../utils/logger.js"

const MODULE = "validators :: context_extractor :: prediction"

export const validatePredictionRequest = async (req: PredictionRequest): Promise<[boolean, Object]> => {
    try {
        const value = await predictionRequestSchema.validateAsync(req)
        logger(MODULE, `Validated prediction request`)
        return [true, value]
    } catch (err) {
        logger(MODULE, `Could not validate prediction reuqest: ${err}`, LogType.ERR)
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
        .max(5000000) // ~5MB string
        .required()
})