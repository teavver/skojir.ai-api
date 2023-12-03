
import { Server } from "net"
import { logger, LogType } from "../utils/logger.js"
import { User } from "../models/User.js"
import { main } from "../server.js"

const MODULE = "tests :: setup"
let server: Server | null

export const testBaseURL = "http://localhost:3000"

export async function setupTests(module: string) {
    logger(MODULE, `Setting up test file: ${module} ...`)
    if (!server) {
        server = main()
    }
    await User.deleteMany({}) // clear the Users before
    logger(MODULE, "Test file setup OK", LogType.SUCCESS)
}

export async function cleanupTest(module: string) {
    await User.deleteMany({}) // clear the Users after
    logger(MODULE, `Test ${module} cleanup OK`, LogType.SUCCESS)
}

export async function teardownTests(module: string) {
    if (server) {
        server.close()
        server = null
        logger(MODULE, `Test ${module} teardown OK`, LogType.SUCCESS)
    }
}