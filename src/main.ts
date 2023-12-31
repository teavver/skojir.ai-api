import cors from "cors"
import { OpenAI } from "openai"
import Mailjet from "node-mailjet"
import { execSync } from "child_process"
import express, { Express } from "express"
import { logger, LogType } from "./utils/logger.js"
import { createOpenAIClient } from "./clients/openAI.js"
import { createDbClient } from "./clients/db.js"
import { envSetup } from "./utils/envSetup.js"
import { setupRoutes } from "./utils/setupRoutes.js"
import { createMailjetClient } from "./clients/mailjet.js"

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
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }))

    setupRoutes(app)

    const ver = execSync('git rev-parse HEAD').toString().slice(0, 7)
    logger(MODULE, `Running version: ${ver}`)
    logger(MODULE, "All set up.", LogType.SUCCESS)
}

export { app, init, openAIClient, mailjetClient }

