import { logger, LogType } from "./utils/logger.js"
import { createOpenAIClient } from "./clients/openAI.js"
import { createDbClient } from "./clients/db.js"
import dotenv from "dotenv"
import express from "express"
import { envCheck } from "./utils/envCheck.js"
import { OpenAI } from "openai"
import solverRoute from "./routes/solver.js"
import statusRoute from "./routes/status.js"

dotenv.config()

const app = express()
const MODULE = "main"
let openAIClient: OpenAI

async function init() {
    
    const envStatus = envCheck()
    if (!envStatus) process.exit(1)

    openAIClient = createOpenAIClient()
    await createDbClient()

    app.use(express.json({ limit: "2.5mb" }))
    app.use("/solve", solverRoute)
    app.use("/", statusRoute)

    logger(MODULE, "All set up!")
}

export { app, init, openAIClient }