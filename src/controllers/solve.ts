import { Request, Response } from "express"
import { ResponseMessage } from "../types/responses/ResponseMessage.js"
import { logger, LogType } from "../utils/logger.js"
import { validOutputFormats, SolveRequest } from "../types/requests/client/SolveRequest.js"
import { requestContextPrediction } from "../services/predictContext.js"
import { PredictionRequest } from "../types/requests/PredictionRequest.js"
import { sendVisionPrompt } from "../services/sendVisionPrompt.js"
import { validateRequestBody } from "../utils/verifyRequestBody.js"

const MODULE = "controllers :: solver"

export async function solveScreenshot(req: Request<SolveRequest>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`
        })
    }

    const { img, outputFormat, threshold }: SolveRequest = req.body

    // first upload the screenshot to GCF to compute + crop the context region
    logger(MODULE, "Sending context req to GCF")
    const contextPredictionReq: PredictionRequest = {
        img: img,
        threshold: threshold
    }

    const contextRes = await requestContextPrediction(contextPredictionReq)
    
    if (contextRes.err) {
        logger(MODULE, contextRes.errMsg, LogType.ERR)
        return res.status(500).json({
            state: "error",
            message: contextRes.errMsg
        })
    }

    // validate outputFormat
    if (!validOutputFormats.includes(outputFormat)) return res.status(400).json({
        state: "error",
        message: "Unsupported 'outputFormat' value"
    })

    const b64Prefix = "data:image/jpg;base64," // OpenAI needs the prefix for some reason
    const fullExtractedImg = b64Prefix + contextRes.data

    const gptRes = await sendVisionPrompt({
        outputFormat: outputFormat,
        img: fullExtractedImg,
        threshold,
    })

    if (gptRes.err) {
        logger(MODULE, gptRes.errMsg, LogType.ERR)
        return res.status(500).json({
            state: "error",
            message: gptRes.errMsg
        })
    }

    return res.status(200).json({
        state: "success",
        message: gptRes.data as string
    })
}