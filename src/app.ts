import { logger, LogType } from "./utils/logger.js"
import { createOpenAIClient } from "./clients/openAI.js"
import { createDbClient } from "./clients/db.js"
import dotenv from "dotenv"
import express from "express"
import { envSetup } from "./utils/envSetup.js"
import { OpenAI } from "openai"
import solverRoute from "./routes/solver.js"
import statusRoute from "./routes/status.js"
import { createMailjetClient } from "./clients/mailjet.js"
import Mailjet from "node-mailjet"

dotenv.config()

const app = express()
const MODULE = "main"

let openAIClient: OpenAI
let mailjetClient: Mailjet

async function init() {
    
    const envStatus = envSetup()
    if (!envStatus) process.exit(1)

    openAIClient = createOpenAIClient()
    mailjetClient = createMailjetClient()
    await createDbClient()

    app.use(express.json({ limit: "2.5mb" }))
    app.use("/solve", solverRoute)
    app.use("/status", statusRoute)

    logger(MODULE, "All set up!")
}

export { app, init, openAIClient, mailjetClient }