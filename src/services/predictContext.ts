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

    const vRes = await validateContextPredictionRequest(req)

    if (!vRes.isValid){
        const err = "Failed to validate request"
        logger(MODULE, err, LogType.ERR)
        return {
            err: true,
            errMsg: err,
            statusCode: 400
        }
    }

    try {
        const url = process.env.BACKEND_URL + "/predict"
        const res = await axios.post(url, vRes.data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return {
            err: false,
            data: res.data.result,
            statusCode: 200
        }
    } catch (err) {
        logger(MODULE, `Err: ${err}`, LogType.ERR)
        return {
            err: true,
            errMsg: (err as Error).message,
            statusCode: 500
        }
    }

}