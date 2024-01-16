import Joi from "joi"
import { PredictionRequest } from "../../../types/requests/PredictionRequest"

export const predictionRequestSchema = Joi.object<PredictionRequest>({
    img: Joi.string()
        .min(10)
        .max(2500000) // ~2.5MB string
        .required(),
    threshold: Joi.number().min(0.1).max(0.5).required(),
})
