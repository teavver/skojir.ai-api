import { LogType, logger } from "../utils/logger.js"
import OpenAI from "openai"

const MODULE = "clients :: openAI"

export function createOpenAIClient() {
    const apiKey = process.env.OPENAI_KEY
    logger(MODULE, "OpenAI Client initialized", LogType.SUCCESS)
    return new OpenAI({
        apiKey
    })
}
