/**
 * Checks for missing or empty body in POST requests
 * @param body - Request body
 * @returns Result of validation process 
 */
export const validateRequestBody = (body: any): boolean => {
    if (!body || Object.keys(body).length === 0) {
        return false
    }
    return true
}