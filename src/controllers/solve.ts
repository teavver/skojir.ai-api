import { Request, Response } from "express"
import { ResponseMessage } from "../types/responses/ResponseMessage.js"
import { logger, LogType } from "../utils/logger.js"
import { validOutputFormats, SolveRequest } from "../types/requests/SolveRequest.js"
import { requestContextPrediction } from "../services/predictContext.js"
import { PredictionRequest } from "../types/requests/PredictionRequest.js"
import { sendVisionPrompt } from "../services/sendVisionPrompt.js"
import { validateRequestBody } from "../utils/verifyRequestBody.js"

const MODULE = "controllers :: solve"

export async function solveScreenshot(req: Request<SolveRequest>, res: Response<ResponseMessage>) {

    const validBody = validateRequestBody(req.body)
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`
        })
    }

    const { email, img, outputFormat, threshold }: SolveRequest = req.body

    if (!validOutputFormats.includes(outputFormat)) {
        return res.status(400).json({
            state: "error",
            message: "Unsupported 'outputFormat' value"
        })
    }

    logger(MODULE, "Sending context req to GCF")
    const contextPredictionReq: PredictionRequest = {
        img: img,
        threshold: threshold
    }

    const contextRes = await requestContextPrediction(contextPredictionReq)
    
    if (contextRes.err) {
        logger(MODULE, contextRes.errMsg, LogType.ERR)
        return res.status(contextRes.statusCode).json({
            state: "error",
            message: contextRes.errMsg
        })
    }

    const b64Prefix = "data:image/jpg;base64," // OpenAI requires b64 prefix
    const fullExtractedImg = b64Prefix + contextRes.data

    const gptRes = await sendVisionPrompt({
        email: email,
        outputFormat: outputFormat,
        img: fullExtractedImg,
        threshold,
    })

    if (gptRes.err) {
        logger(MODULE, gptRes.errMsg, LogType.ERR)
        return res.status(gptRes.statusCode).json({
            state: "error",
            message: gptRes.errMsg
        })
    }

    return res.status(gptRes.statusCode).json({
        state: "success",
        message: gptRes.data as string
    })
}