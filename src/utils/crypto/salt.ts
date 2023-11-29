import { randomBytes } from "crypto";

export function generateSalt(bytes: number = 32): string {
    return randomBytes(bytes).toString('hex')
}