import axios, { AxiosResponse } from "axios"
import { PredictionRequest } from "../types/requests/PredictionRequest.js"
import { validateRequest } from "../utils/validateRequest.js"
import { predictionRequestSchema } from "../middlewares/validators/schemas/predictionRequestSchema.js"
import { logger, LogType } from "../utils/logger.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import { Request } from "express"
import { SolveRequest } from "../types/requests/SolveRequest.js"

const MODULE = "services :: predictContext"
const DEFAULT_THRESHOLD_VALUE = 0.25

export async function requestContextPrediction(
    req: Request<SolveRequest>,
    predReqData: PredictionRequest,
): Promise<ServiceResponse<PredictionRequest>> {
    const vRes = await validateRequest<PredictionRequest>(MODULE, predReqData, predictionRequestSchema)
    if (!vRes.isValid) {
        const err = `Failed to validate request: ${vRes.error}`
        logger(MODULE, err, LogType.ERR)
        return {
            err: true,
            errMsg: err,
            statusCode: 400,
        }
    }

    // handle optional threshold value
    if (!predReqData.threshold) {
        predReqData.threshold = DEFAULT_THRESHOLD_VALUE
    }

    try {
        const url = process.env.BACKEND_URL + "/predict"
        const token = req.headers.authorization?.split(" ")[1]
        const res = await axios.post(url, predReqData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return {
            err: false,
            data: res.data,
            statusCode: 200,
        }
    } catch (err) {
        let res: AxiosResponse | undefined = undefined
        if (axios.isAxiosError(err)) res = err.response
        return {
            err: true,
            errMsg: res ? res.data : "Internal service error",
            statusCode: res ? res.status : 500,
        }
    }
}
