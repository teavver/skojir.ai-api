import Joi from "joi"
import { PredictionRequest } from "../../../models/context_extractor/prediction.js"
import { logger, LogType } from "../../../utils/logger.js"

const MODULE = "validators :: context_extractor :: prediction"

export const validatePredictionRequest = async (req: PredictionRequest): Promise<boolean> => {
    const validate = await predictionRequestSchema.validateAsync(req)
    if (validate.error){
        logger(MODULE, validate.error.message, LogType.ERR)
        return false
    }
    if (validate.warning) logger(MODULE, validate.warning.message, LogType.WARN)
    return true
}

const predictionRequestSchema = Joi.object({
    threshold: Joi.number()
        .min(0.1)
        .max(0.5)
        .required(),
        
    img: Joi.string()
        .min(10)
        .max(5000000) // ~5MB string
        .required()
})