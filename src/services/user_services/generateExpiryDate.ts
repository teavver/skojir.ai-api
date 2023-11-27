


/**
 * Generates an expiry Date for an event
 */
export function generateExpiryDate(minutes: number = 10): Date {
    const SECOND_IN_MS = 1000
    const MINUTE_IN_MS = SECOND_IN_MS * 60
    return new Date(Date.now() + (minutes * MINUTE_IN_MS))
}