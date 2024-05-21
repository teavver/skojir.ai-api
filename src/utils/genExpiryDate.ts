import { logger } from "./logger.js"

const MODULE = "utils :: generateExpiryDate"

/**
 * Generates timestamp (Date) for an event
 * @param minutes How many minutes from now the time should be. Default = 10
 * @returns Generated date
 */
export function generateExpiryDate(minutes: number = 10): Date {
    const SECOND_IN_MS = 1000
    const MINUTE_IN_MS = SECOND_IN_MS * 60
    const ts = new Date(Date.now() + minutes * MINUTE_IN_MS)
    logger(MODULE, `Event timer generated: ${ts}`)
    return ts
}
