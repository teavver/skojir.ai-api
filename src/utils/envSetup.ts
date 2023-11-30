import { logger, LogType } from "./logger.js"
import dotenv from "dotenv"

const MODULE = "utils :: envCheck"

/**
 * Checks if all .env keys are present and non-empty
 */
export function envSetup(): boolean {

    dotenv.config()

    // This array should ALWAYS match the ProcessEnv interface in /types/environment.d.ts
    const envKeys = [
        'OPENAI_KEY',
        'DB_URL_PROD',
        'DB_URL_DEV',
        'DB_COLLECTION',
        'BACKEND_URL',
        'MAILJET_API_KEY',
        'MAILJET_SECRET_KEY',
        'ENV',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'PORT'
    ]

    logger(MODULE, "Setting up environment")

    for (const key of envKeys) {
        if (!process.env[key]) {
            logger(MODULE, `.Env key ${key} is missing.`, LogType.ERR)
            return false
        }
    }

    logger(MODULE, "Environment set up")
    
    return true
}