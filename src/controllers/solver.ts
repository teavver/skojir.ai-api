import { Request, Response } from "express"
import { ResponseMessage } from "../types/responses/ResponseMessage.js"
import { logger, LogType } from "../utils/logger.js"
import { SolverRequest } from "../types/requests/SolverRequest.js"
import { requestContextPrediction } from "../services/predictContext.js"
import { requestVisionPrompt } from "../services/visionPrompt.js"

const MODULE = "controllers :: solver"

export async function solveScreenshot(req: Request<SolverRequest>, res: Response<ResponseMessage>) {

    const { header, img, footer, threshold, max_tokens } = req.body

    // first upload the ss to GCF and compute + crop the context region
    logger(MODULE, "Sending context req to GCF")
    const { err: gcfErr, errMsg: gcfErrMsg, data: gcfCroppedImg } = await requestContextPrediction({ threshold, img })
    
    if (gcfErr) {
        logger(MODULE, gcfErrMsg!, LogType.ERR)
        return res.status(500).json({
            state: "error",
            message: gcfErrMsg
        })
    }
    
    logger(MODULE, "Sending vision prompt req to OpenAI")
    const { err: gptErr, errMsg: gptErrMsg, data: gptData } = await requestVisionPrompt({
        header: header,
        img: gcfCroppedImg,
        footer: footer,
        max_tokens: max_tokens
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