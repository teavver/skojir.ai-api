import { logger } from "../utils/logger.js"
import OpenAI from "openai"

const MODULE = "clients :: openAI"

export function createOpenAIClient() {
    const apiKey = process.env.OPENAI_KEY
    logger(MODULE, "Init openAI client")
    return new OpenAI({
        apiKey,
        timeout: 60,
        maxRetries: 3,
        organization: "skojir"
    })
}
