import { logger, LogType } from "./utils/logger.js"
import dotenv from "dotenv"
import express from "express"
import { OpenAI } from "openai"
import mongoose from "mongoose"
import solverRoute from "./routes/solver.js"
import statusRoute from "./routes/status.js"

dotenv.config()

const app = express()
const MODULE = "main"
let openAIClient: OpenAI

function createOpenAIClient() {
    const apiKey = process.env.OPENAI_KEY
    if (!apiKey) {
        logger(MODULE, "Failed to get OpenAI .env key", LogType.ERR)
        process.exit(1)
    }
    logger(MODULE, "Init openAI client")
    return new OpenAI({ apiKey })
}

async function createDbClient() {
    const dbURL = (process.env.ENV === "DEV") ? process.env.DB_URL_DEV : process.env.DB_URL_PROD
    if (!dbURL) { 
        logger(MODULE, "Missing DB .env", LogType.ERR)
        process.exit(1)
    }
    logger(MODULE, "Connecting to db...")
    try {
        await mongoose.connect(dbURL)
        logger(MODULE, "Connected to db.")
    } catch (err) {
        logger(MODULE, `Err while connecting to db: ${err}`, LogType.ERR)
        process.exit(1)
    }
}

async function init() {
    logger(MODULE, "Setting up environment")
    const env = process.env.ENV
    if (!env) {
        logger(MODULE, "No ENV value in .env", LogType.ERR)
        process.exit(1)
    }

    openAIClient = createOpenAIClient()
    await createDbClient()

    app.use(express.json({ limit: "2.5mb" }))
    app.use("/solve", solverRoute)
    app.use("/", statusRoute)

    logger(MODULE, "All set up!")
}

export { app, init, openAIClient }