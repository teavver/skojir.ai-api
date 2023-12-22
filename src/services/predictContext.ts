import axios from "axios"
import { PredictionRequest } from "../types/requests/PredictionRequest.js"
import { validateContextPredictionRequest } from "../middlewares/validators/contextPrediction.js"
import { logger, LogType } from "../utils/logger.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"

const MODULE = "services :: predictContext"
const DEFAULT_THRESHOLD_VALUE = 0.25

export async function requestContextPrediction(reqBody:any): Promise<ServiceResponse<PredictionRequest>> {

    const vRes = await validateContextPredictionRequest(reqBody)
    if (!vRes.isValid){
        const err = `Failed to validate request: ${vRes.error}`
        logger(MODULE, err, LogType.ERR)
        return {
            err: true,
            errMsg: err,
            statusCode: 400
        }
    }

    // handle optional threshold value
    const vData: PredictionRequest = vRes.data
    if (!vData.threshold) {
        vData.threshold = DEFAULT_THRESHOLD_VALUE
    }

    try {
        const url = process.env.BACKEND_URL + "/predict"
        const res = await axios.post(url, vData, {
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