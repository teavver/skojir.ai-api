import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import mongoose from "mongoose"
import { openAIClient } from "../app.js"
import axios from "axios"
import { logger, LogType } from "../utils/logger.js"

const MODULE = "services :: getStatus"

/**
 * Get status of API services
 */

export async function getStatus(): Promise<ServiceResponse> {

    let res: ServiceResponse = {
        err: false,
        data: ""
    }

    let backendStatus = "unknown"
    let dbStatus = "unknown"

    // Check DB status
    switch (mongoose.connection.readyState) {
        case 0: dbStatus = 'disconnected'; break
        case 1: dbStatus = 'connected'; break
        case 2: dbStatus = 'connecting'; break
        case 3: dbStatus = 'disconnecting'; break
    }
    
    // Check backend status
    try {
        const res = await axios.get(process.env.BACKEND_URL + "/status", {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        backendStatus = res.data.status
    } catch (err) {
        logger(MODULE, `Backend status err: ${err}`, LogType.WARN)
        backendStatus = "offline"
    }

    const data = {
        backendStatus,
        dbStatus
    }

    res.data = JSON.stringify(data)
    return res

}