import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import mongoose from "mongoose"
import axios from "axios"
import { logger, LogType } from "../utils/logger.js"
import { responseCodes } from "../utils/responseCodes.js"

const MODULE = "services :: getStatus"

export async function getStatus(): Promise<ServiceResponse<string>> {
    let backendStatus = "unknown"
    let dbStatus = "unknown"
    let openAIStatus = "unknown"

    try {
        // db
        switch (mongoose.connection.readyState) {
            case 0:
                dbStatus = "disconnected"
                break
            case 1:
                dbStatus = "connected"
                break
            case 2:
                dbStatus = "connecting"
                break
            case 3:
                dbStatus = "disconnecting"
                break
        }

        // backend
        try {
            const backendRes = await axios.get(process.env.BACKEND_URL + "/health", {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            backendStatus = backendRes.data
        } catch (err) {
            logger(MODULE, `Backend status err: ${err}`, LogType.WARN)
            backendStatus = "offline"
        }

        // openai
        try {
            const openAIStatusURL = "https://status.openai.com/api/v2/status.json"
            const openAIRes = await axios.get(openAIStatusURL)
            const status = openAIRes.data.status.description
            logger(MODULE, status)
            openAIStatus = status
        } catch (err) {
            logger(MODULE, `Failed to get OpenAI status`)
            openAIStatus = "error"
        }

        const data = {
            backendStatus,
            dbStatus,
            openAIStatus,
        }

        return {
            err: false,
            data: JSON.stringify(data, null, 2),
            statusCode: responseCodes.SUCCESS,
        }
    } catch (err) {
        logger(MODULE, `Get status err: ${err}`, LogType.WARN)
        return {
            err: true,
            errMsg: (err as Error).message,
            statusCode: responseCodes.INTERNAL_SERVER_ERROR,
        }
    }
}
