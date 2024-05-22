import { Server } from "net"
import { logger, LogType } from "../utils/logger.js"
import { User } from "../models/User.js"
import { main } from "../server.js"
import { IUserCredentials } from "../types/interfaces/IUserCredentials.js"

const MODULE = "tests :: setup"
let server: Server | null

// Endpoints for tests
export const testBaseURL = "http://localhost:3000"
export const gcfBaseURL = process.env.BACKEND_URL || "http://localhost:8080"
export const gcfStatusURL = gcfBaseURL + "/status"
export const registerURL = testBaseURL + "/register"
export const deleteURL = testBaseURL + "/delete"
export const emailChangeURL = testBaseURL + "/email-change"
export const emailChangeOTPURL = testBaseURL + "/email-change-otp"
export const pwdChangeOTPURL = testBaseURL + "/pwd-change-otp"
export const accountInfoURL = testBaseURL + "/account-info"
export const solveURL = testBaseURL + "/solve"
export const verifyURL = testBaseURL + "/auth/verify"
export const loginURL = testBaseURL + "/auth/login"
export const refreshTokensURL = testBaseURL + "/auth/refresh"

// Test user
export const testUser: IUserCredentials = {
    email: "test@example.com",
    password: "Password123!",
}

export const testUser2: IUserCredentials = {
    email: "test23@example.com",
    password: "Password123@",
}

export async function setupTests(module: string) {
    logger(MODULE, `Setting up test file: ${module} ...`)
    if (!server) {
        server = main()
    }
    await User.deleteMany({})
    logger(MODULE, "Test file setup OK", LogType.SUCCESS)
}

export async function teardownTests(module: string) {
    if (server) {
        server.close()
        server = null
    }
    await User.deleteMany({})
    logger(MODULE, `Test ${module} teardown OK`, LogType.SUCCESS)
}
