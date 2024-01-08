
import { Server } from "net"
import { logger, LogType } from "../utils/logger.js"
import { User } from "../models/User.js"
import { main } from "../server.js"
import { IUserCredentials } from "../types/interfaces/IUserCredentials.js"

const MODULE = "tests :: setup"
let server: Server | null

// Endpoints for tests
export const gcfBaseURL = process.env.BACKEND_URL || "http://localhost:8080"
export const gcfStatusURL = gcfBaseURL + "/status"
export const gcfSolveURL = gcfBaseURL + "/predict"
export const testBaseURL = "http://localhost:3000"
export const registerURL = testBaseURL + "/register"
export const verifyURL = testBaseURL + "/auth/verify"
export const loginURL = testBaseURL + "/auth/login"
export const deleteURL = testBaseURL + "/delete"
export const emailOTPURL = testBaseURL + "/email-otp"
export const emailChangeURL = testBaseURL + "/email-change"

// Test user
export const testUser: IUserCredentials = {
    email: "test@example.com",
    password: "Password123!"
}


export async function setupTests(module: string) {
    logger(MODULE, `Setting up test file: ${module} ...`)
    if (!server) {
        server = main()
    }
    await User.deleteMany({}) // clear the Users after
    logger(MODULE, "Test file setup OK", LogType.SUCCESS)
}

export async function teardownTests(module: string) {
    if (server) {
        server.close()
        server = null
    }
    await User.deleteMany({}) // clear the Users after
    logger(MODULE, `Test ${module} teardown OK`, LogType.SUCCESS)
}