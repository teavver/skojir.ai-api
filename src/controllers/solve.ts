import { Request, Response } from "express"
import { ResponseMessage } from "../types/responses/ResponseMessage.js"
import { logger, LogType } from "../utils/logger.js"
import { validOutputFormats, SolveRequest } from "../types/requests/SolveRequest.js"
import { requestContextPrediction } from "../services/predictContext.js"
import { PredictionRequest } from "../types/requests/PredictionRequest.js"
import { sendVisionPrompt } from "../services/sendVisionPrompt.js"
import { validateRequestBody } from "../utils/verifyRequestBody.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import { writeFile } from "fs"
import path from "path"

const MODULE = "controllers :: solve"

export async function solveScreenshot(req: Request<SolveRequest>, res: Response<ResponseMessage>) {
    const validBody = validateRequestBody(req.body, ["img", "outputFormat"])
    if (!validBody) {
        return res.status(400).json({
            state: "error",
            message: `Request body is empty or incomplete`,
        })
    }

    const { img, outputFormat, threshold } = req.body
    if (!validOutputFormats.includes(outputFormat)) {
        return res.status(400).json({
            state: "error",
            message: "Unsupported 'outputFormat' value",
        })
    }

    logger(MODULE, "Sending context req to GCF")
    const contextPredictionData: PredictionRequest = {
        img: img,
        threshold: threshold,
    }
    const contextRes: ServiceResponse<string> = await requestContextPrediction(req, contextPredictionData)
    if (contextRes.err) {
        logger(MODULE, JSON.stringify(contextRes, null, 4), LogType.ERR)
        return res.status(contextRes.statusCode).json({
            state: "error",
            message: contextRes.errMsg,
        })
    }

    const b64Prefix = "data:image/jpg;base64," // OpenAI requires b64 prefix
    const b64String = contextRes.data
    const b64Img = b64Prefix + b64String

    // Save prediction result to file in development
    if (process.env.ENV === "DEV") {
        const buf = Buffer.from(b64String, 'base64')
        const fname = `img ${Date.now()}.png`
        const fpath = path.join(process.cwd(), fname)
        writeFile(fpath, buf, (err) => {
            if (err) logger(MODULE, `(DEBUG) Err while saving prediction result to file. Err: ${err}`, LogType.WARN)
            else logger(MODULE, `(DEBUG) Saved prediction result as ${fname}`, LogType.SUCCESS)
        })
    }

    const reqData: SolveRequest = {
        outputFormat: outputFormat,
        img: b64Img,
        threshold: threshold,
    }

    logger(MODULE, "Sending vision prompt req to OpenAI...")
    const gptRes: ServiceResponse<string> = await sendVisionPrompt(reqData)
    if (gptRes.err) {
        logger(MODULE, gptRes.errMsg, LogType.ERR)
        return res.status(gptRes.statusCode).json({
            state: "error",
            message: gptRes.errMsg,
        })
    }

    logger(MODULE, "Solve OK")
    return res.status(gptRes.statusCode).json({
        state: "success",
        message: gptRes.data as string,
    })
}
