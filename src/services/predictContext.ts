import axios, { AxiosResponse } from "axios"
import { PredictionRequest } from "../types/requests/PredictionRequest.js"
import { validateRequest } from "../utils/validateRequest.js"
import { predictionRequestSchema } from "../middlewares/validators/schemas/predictionRequestSchema.js"
import { logger, LogType } from "../utils/logger.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import { Request } from "express"
import { SolveRequest } from "../types/requests/SolveRequest.js"
import { responseCodes } from "../utils/responseCodes.js"

const MODULE = "services :: predictContext"
const DEFAULT_THRESHOLD_VALUE = parseFloat("0.2")

export async function requestContextPrediction(
    req: Request<SolveRequest>,
    predReqData: PredictionRequest,
): Promise<ServiceResponse<string>> {

    // Handle optional threshold value before validating data
    if (!predReqData.threshold) {
        predReqData.threshold = +DEFAULT_THRESHOLD_VALUE
        logger(MODULE, `Using default threshold value (${predReqData.threshold})`)
    }

    const vRes = await validateRequest<PredictionRequest>(MODULE, predReqData, predictionRequestSchema)
    if (!vRes.isValid) {
        const err = `Failed to validate request: ${vRes.error}`
        logger(MODULE, err, LogType.ERR)
        return {
            err: true,
            errMsg: err,
            statusCode: responseCodes.BAD_REQUEST,
        }
    }

    try {
        const url = process.env.BACKEND_URL + "/predict"
        const token = req.headers.authorization?.split(" ")[1]
        logger(MODULE, `Sending /predict request... (Token: ${token?.substring(0, 6)}...)`)
        const res = await axios.post(url, predReqData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return {
            err: false,
            data: res.data,
            statusCode: responseCodes.SUCCESS,
        }
    } catch (err) {
        let res: AxiosResponse | undefined = undefined
        if (axios.isAxiosError(err)) res = err.response
        return {
            err: true,
            errMsg: res ? res.data : "Internal service error",
            statusCode: res ? res.status : responseCodes.INTERNAL_SERVER_ERROR,
        }
    }
}
