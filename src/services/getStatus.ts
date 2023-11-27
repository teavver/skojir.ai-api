import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import mongoose from "mongoose"
import axios from "axios"
import { logger, LogType } from "../utils/logger.js"

const MODULE = "services :: getStatus"

/**
 * Get status of API and underlying clients
 */

export async function getStatus(): Promise<ServiceResponse> {

    let backendStatus = "unknown"
    let dbStatus = "unknown"
    let openAIStatus = "unknown"

    // Check DB status
    switch (mongoose.connection.readyState) {
        case 0: dbStatus = 'disconnected'; break
        case 1: dbStatus = 'connected'; break
        case 2: dbStatus = 'connecting'; break
        case 3: dbStatus = 'disconnecting'; break
    }
    
    // Check backend status
    try {
        const backendRes = await axios.get(process.env.BACKEND_URL + "/status", {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        backendStatus = backendRes.data.status
    } catch (err) {
        logger(MODULE, `Backend status err: ${err}`, LogType.WARN)
        backendStatus = "offline"
    }

    // Check openAI / GPT status
    try {
        const openAIRes = await axios.get("https://status.openai.com/api/v2/status.json")
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
        openAIStatus
    }

    return {
        err: false,
        data: JSON.stringify(data)
    }

}