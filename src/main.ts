import { logger, LogType } from "./utils/logger.js"
import { createOpenAIClient } from "./clients/openAI.js"
import { createDbClient } from "./clients/db.js"
import express, { Express } from "express"
import { envSetup } from "./utils/envSetup.js"
import { OpenAI } from "openai"
import { setupRoutes } from "./utils/setupRoutes.js"
import { createMailjetClient } from "./clients/mailjet.js"
import Mailjet from "node-mailjet"

const MODULE = "main"

const app: Express = express()
let openAIClient: OpenAI
let mailjetClient: Mailjet

async function init() {
    
    const envStatus = envSetup()
    if (!envStatus) process.exit(1)

    openAIClient = createOpenAIClient()
    mailjetClient = createMailjetClient()
    await createDbClient()

    app.use(express.json({ limit: "2.5mb" }))
    setupRoutes(app)

    logger(MODULE, "All set up!")
}

export { app, init, openAIClient, mailjetClient }
