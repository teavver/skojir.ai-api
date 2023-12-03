
import { Server } from "net"
import { logger, LogType } from "../utils/logger.js"
import { User } from "../models/User.js"
import { main } from "../server.js"

const MODULE = "tests :: setup"
let server: Server

export const testBaseURL = "http://localhost:3000"

export async function setupTests(module: string) {
    logger(MODULE, `Setting up test file: ${module}...`)

    if (!server) {
        server = main()
    }

    await User.deleteMany({}) // clear the Users collection before running
    logger(MODULE, "Test setup OK", LogType.SUCCESS)
}

export async function teardownTests(module: string) {
    if (server) {
        server.close()
        logger(MODULE, `Test ${module} teardown OK`, LogType.SUCCESS)
    }
}