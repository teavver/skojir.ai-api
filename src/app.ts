import { logger, LogType } from "./utils/logger.js"
import dotenv from "dotenv"
import express from "express"
import { MongoClient } from "mongodb"
import { OpenAI } from "openai"
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
    logger(MODULE, "Init openAI client")
    return new OpenAI({ apiKey })
}

async function createDbClient() {
    const dbURL = process.env.DB_URL
    if (!dbURL) { 
        logger(MODULE, "Missing DB .env", LogType.ERR)
        process.exit(1)
    }
    logger(MODULE, "Connecting to db...")
    const dbClient = new MongoClient(dbURL)
    try {
        await dbClient.connect()
        logger(MODULE, "Connected to db.")
        return dbClient
    } catch (err) {
        logger(MODULE, `Err while connecting to db: ${err}`, LogType.ERR)
        process.exit(1)
    } finally {
        await dbClient.close()
    }
}

async function init() {

    logger(MODULE, "Setting up environment")
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
init()

export { app, openAIClient, dbClient }