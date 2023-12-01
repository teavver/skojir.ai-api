import { ResponseState, ResponseMessage } from "../types/responses/ResponseMessage.js";
import { logger, LogType } from "./logger.js";

export function createResponseAndLog(state: ResponseState, module:string, message?: string, logType: LogType = LogType.NORMAL): ResponseMessage {
    
    const response: ResponseMessage = { state, message }
    if (message) {
        logger(module, message, logType)
    }

    return response
}