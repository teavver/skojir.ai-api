import { createClient } from "@supabase/supabase-js"
import { logger, LogType } from "./utils/logger.js"
import dotenv from "dotenv"
import express from "express"
import { OpenAI } from "openai/index.mjs"
import solverRoute from "./routes/solver.js"
import statusRoute from "./routes/status.js"

dotenv.config()

const app = express()
const MODULE = "main"

function createOpenAIClient() {
    const apiKey = process.env.OPENAI_KEY
    if (!apiKey) {
        logger(MODULE, "Failed to get OpenAI .env key", LogType.ERR)
        process.exit(1)
    }
    logger(MODULE, "Init openAI Client")
    return new OpenAI({ apiKey })
}

function createDbClient() {
    const dbUrl = process.env.SUPABASE_URL
    const dbKey = process.env.SUPABASE_KEY
    if (!dbUrl || !dbKey) {
        logger(MODULE, "Failed to get db .env keys", LogType.ERR)
        process.exit(1)
    }
    logger(MODULE, "Connected to DB")
    return createClient(dbUrl, dbKey )
}

function initialize() {
    logger(MODULE, "Setting up environment...")
    const env = process.env.ENV
    if (!env) {
        logger(MODULE, "No ENV value in .env", LogType.ERR)
        process.exit(1)
    }

    app.use(express.json({ limit: "2.5mb" }))
    app.use("/solve", solverRoute)
    app.use("/", statusRoute)

    logger(MODULE, "All set up!")
}

const openAIClient = createOpenAIClient()
const dbClient = createDbClient()
initialize()

export { app, openAIClient, dbClient }