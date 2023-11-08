import { PredictionRequest } from "../../models/context_extractor/prediction.js"
import { validatePredictionRequest } from "../../middlewares/validators/context_extractor/prediction.js"
import { logger, LogType } from "../../utils/logger.js"
import { ResponseMessage } from "../../types/ResponseMessage.js"
import axios from "axios"
import clipboard from "clipboardy"

const MODULE = "services :: context_extractor :: predict_context"

export async function requestContextPrediction(req: PredictionRequest): Promise<ResponseMessage> {

    const [valid, validReq] = await validatePredictionRequest(req)

    if (!valid){
        const err = "Failed to validate prediction request"
        logger(MODULE, err, LogType.ERR)
        return {
            state: "error",
            message: err
        }
    }

    if (!process.env.CONTEXT_EXTRACTOR_URL){
        const err = "GCF Url not found in .env"
        logger(MODULE, err, LogType.ERR)
        return {
            state: "error",
            message: err
        }
    }

    try {
        const res = await axios.post(process.env.CONTEXT_EXTRACTOR_URL, validReq, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // console.log("STATUS : ", res.status)
        clipboard.writeSync(res.data.result) // copy to clipboard

        return {
            state: "success",
            message: res.data.result
        }
    } catch (err) {
        logger(MODULE, `Err: ${err}`, LogType.ERR)
        return { state: "error" }
    }

}