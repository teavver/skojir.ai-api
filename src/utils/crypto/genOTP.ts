import { logger } from "../logger.js"
import { randomBytes } from "crypto"

const MODULE = "utils :: generateOTP"

/**
 * Generates a random 6-digit verification code (OTP) and returns it as string
 */
export function generateOTP(): string {
    const codeLength = 6
    let code: string = ""

    while (code.length < codeLength) {
        const randomValue = randomBytes(1)[0]
        const digit = randomValue % 10
        code += digit.toString()
    }

    logger(MODULE, `Verification code generated: "${code}"`)
    return code
}
