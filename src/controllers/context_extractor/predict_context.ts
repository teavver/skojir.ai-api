import { Request, Response } from "express"
import * as requestContextService from "../../services/context_extractor/predict_context.js"
import { PredictionRequest } from "../../models/context_extractor/prediction.js"
import { ResponseMessage } from "../../types/ResponseMessage.js"

export const requestContextPrediction = async (req: Request<PredictionRequest>, res: Response<ResponseMessage>) => {
    const { threshold, img } = req.body
    const predRes = await requestContextService.requestContextPrediction({ threshold, img })

    if (predRes.state !== "success") {
        return res.status(400).json({
            state: predRes.state,
            message: predRes.message
        })
    }

    return res.status(200).json({
        state: predRes.state,
        message: predRes.message
    })
}