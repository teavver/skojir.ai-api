import { Request, Response } from "express"
import * as requestContextService from "../../services/context_extractor/predict_context.js"
import { PredictionRequest } from "../../types/context_extractor/PredictionRequest.js"
import { ResponseMessage } from "../../types/ResponseMessage.js"
import { logger, LogType } from "../../utils/logger.js"

const MODULE = "controllers :: context_extractor :: predict_context"

export const requestContextPrediction = async (req: Request<PredictionRequest>, res: Response<ResponseMessage>) => {
    const { threshold, img } = req.body
    const predRes = await requestContextService.requestContextPrediction({ threshold, img })

    if (predRes.state !== "success") {
        logger(MODULE, "prediction request failed", LogType.WARN)
        return res.status(400).json({
            state: predRes.state,
            message: predRes.message
        })
    }
    
    logger(MODULE, "prediction request resolved")
    return res.status(200).json({
        state: predRes.state,
        message: predRes.message
    })
}