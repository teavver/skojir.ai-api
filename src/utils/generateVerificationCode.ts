import { logger } from "./logger.js";

const MODULE = "utils :: generateVerificationCode"

/**
 * Generates a random 6-digit verification code and returns it as string
 * Any digit can be repeated twice, but not more 
 */
export function generateVerificationCode(): string {
    let code = ''
    while (code.length < 6) {
        const digit = Math.floor(Math.random() * 10).toString()
        if (code.endsWith(digit.repeat(2))) {
            continue
        }
        code += digit
    }
    logger(MODULE, `Verification code generated: ${code}`)
    return code
}