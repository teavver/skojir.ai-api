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
        'LOG',
        'ENV',
        'PORT',
        'OPENAI_KEY',
        'DB_URL_PROD',
        'DB_URL_DEV',
        'DB_COLLECTION',
        'BACKEND_URL',
        'MAILJET_API_KEY',
        'MAILJET_SECRET_KEY',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
    ]
    
    for (const key of envKeys) {
        if (!process.env[key]) {
            console.error(`.Env key ${key} is missing.`)
            return false
        }
    }

    logger(MODULE, `App ENV mode: ${process.env.ENV}`, LogType.SERVER, true)
    logger(MODULE, "Environment set up", LogType.NORMAL, true)
    return true
}