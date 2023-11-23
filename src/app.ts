import { logger, LogType } from "./utils/logger.js"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import { OpenAI } from "openai"
import solverRoute from "./routes/solver.js"
import statusRoute from "./routes/status.js"

dotenv.config()

const app = express()
const MODULE = "main"

function createOpenAIClient() {
    const apiKey = process.env.OPENAI_KEY
    if (!apiKey) {
        logger(MODULE, "failed to get OpenAI .env key", LogType.ERR)
        process.exit(1)
    }
    logger(MODULE, "init openAI Client")
    return new OpenAI({ apiKey })
}

async function createDbClient() {
    const dbURL = process.env.DB_URL
    if (!dbURL) {
        logger(MODULE, "missing db URL key in .env")
        process.exit(1)
    }
    try {
        await mongoose.connect(dbURL)
        logger(MODULE, "connected to db")
    } catch (err) {
        logger(MODULE, `err while connecting to db: ${err}`)
        process.exit(1)
    }
}

async function init() {

    logger(MODULE, "setting up environment")
    const env = process.env.ENV
    if (!env) {
        logger(MODULE, "no ENV value in .env", LogType.ERR)
        process.exit(1)
    }

    logger(MODULE, "connecting to db...")
    await createDbClient()

    app.use(express.json({ limit: "2.5mb" }))
    app.use("/solve", solverRoute)
    app.use("/", statusRoute)

    logger(MODULE, "All set up!")
}

const openAIClient = createOpenAIClient()
init()

export { app, openAIClient }