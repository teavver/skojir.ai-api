import { Request, Response } from "express"
import { ResponseMessage } from "../types/responses/ResponseMessage.js"
import { logger, LogType } from "../utils/logger.js"
import { validOutputFormats, SolveRequest } from "../types/requests/SolveRequest.js"
import { requestContextPrediction } from "../services/predictContext.js"
import { PredictionRequest } from "../types/requests/PredictionRequest.js"
import { sendVisionPrompt } from "../services/sendVisionPrompt.js"

const MODULE = "controllers :: solver"

export async function solveScreenshot(req: Request<SolveRequest>, res: Response<ResponseMessage>) {

    const { img, outputFormat, threshold } = req.body

    // first upload the screenshot to GCF to compute + crop the context region
    logger(MODULE, "Sending context req to GCF")
    const contextPredictionReq: PredictionRequest = {
        img: img,
        threshold: threshold
    }
    const { err: gcfErr, errMsg: gcfErrMsg, data: extractedContextImg } = await requestContextPrediction(contextPredictionReq)
    
    if (gcfErr) {
        logger(MODULE, gcfErrMsg!, LogType.ERR)
        return res.status(500).json({
            state: "error",
            message: gcfErrMsg
        })
    }

    // validate outputFormat
    if (!validOutputFormats.includes(outputFormat)) return res.status(400).json({
        state: "error",
        message: "Unsupported 'outputFormat' value"
    })
    
    
    logger(MODULE, "Sending vision request to OpenAI")
    const { err: gptErr, errMsg: gptErrMsg, data: gptData } = await sendVisionPrompt({
        outputFormat: outputFormat,
        img: extractedContextImg,
        threshold,
    })

    if (gptErr) {
        logger(MODULE, gptErrMsg!, LogType.ERR)
        return res.status(500).json({
            state: "error",
            message: gptErrMsg
        })
    }

    return res.status(200).json({
        state: "success",
        message: gptData
    })
}