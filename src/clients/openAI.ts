import { logger, LogType } from "../utils/logger.js"
import OpenAI from "openai"

const MODULE = "clients :: openAI"

export function createOpenAIClient() {
    const apiKey = process.env.OPENAI_KEY
    if (!apiKey) {
        logger(MODULE, "Failed to get OpenAI .env key", LogType.ERR)
        process.exit(1)
    }
    logger(MODULE, "Init openAI client")
    return new OpenAI({
        apiKey,
        timeout: 60,
        maxRetries: 3,
        organization: "skojir"
    })
}
