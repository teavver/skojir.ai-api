import { Request, Response } from "express"
import * as requestContextService from "../../services/context_extractor/predict_context.js"
import { PredictionRequest } from "../../models/context_extractor/prediction.js"

export const requestContextPrediction = async (req: PredictionRequest) => {
    const res = await requestContextService.requestContextPrediction(req)

}