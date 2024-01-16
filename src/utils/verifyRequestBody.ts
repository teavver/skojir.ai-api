import { Request } from "express"

/**
 * Checks for missing or empty body in POST requests
 * @param body - Request body
 * @param expectedFields - If you're expecting the request body to have certain fields
 * @returns Result of validation process
 */
export const validateRequestBody = (body: Request["body"], expectedFields?: Array<string>): boolean => {
    if (!body || Object.keys(body).length === 0) {
        return false
    }
    if (expectedFields) {
        for (let i = 0; i < expectedFields.length; i++) {
            if (!body[expectedFields[i]]) return false
        }
    }
    return true
}
