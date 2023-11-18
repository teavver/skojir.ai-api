import { PredictionRequest } from "../types/requests/PredictionRequest.js"
import { validateContextPredictionRequest } from "../middlewares/validators/contextPrediction.js"
import { logger, LogType } from "../utils/logger.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import axios from "axios"

const MODULE = "services :: predictContext"
const DEFAULT_THRESHOLD_VALUE = 0.25

/**
 * Sends a request to GCF endpoint and returns b64-encoded string of cropped context region
 */
export async function requestContextPrediction(req: PredictionRequest): Promise<ServiceResponse> {

    // handle optional threshold value
    if (!req.threshold) {
        req.threshold = DEFAULT_THRESHOLD_VALUE
    }

    const [valid, reqData] = await validateContextPredictionRequest(req) as [boolean, PredictionRequest]

    if (!valid){
        const err = "Failed to validate prediction req"
        logger(MODULE, err, LogType.ERR)
        return {
            err: true,
            errMsg: err,
            data: ""
        }
    }

    if (!process.env.CONTEXT_EXTRACTOR_URL){
        const err = "GCF Url not found in .env"
        logger(MODULE, err, LogType.ERR)
        return {
            err: true,
            errMsg: err,
            data: ""
        }
    }

    try {
        const res = await axios.post(process.env.CONTEXT_EXTRACTOR_URL, reqData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return {
            err: false,
            data: res.data.result
        }
    } catch (err) {
        logger(MODULE, `Err: ${err}`, LogType.ERR)
        return {
            err: true,
            errMsg: (err as Error).message,
            data: ""
        }
    }

}