import { createHash } from "crypto"

/**
 * Hashing function for user passwords (sha256)
 */
export function hashPwd(pwd: string): string {
    return createHash("sha256").update(pwd).digest('hex')
}