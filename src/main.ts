import cors from "cors"
import cookieParser from "cookie-parser"
import { OpenAI } from "openai"
import Mailjet from "node-mailjet"
import express, { Express } from "express"
import { logger, LogType } from "./utils/logger.js"
import { createOpenAIClient } from "./clients/openAI.js"
import { createDbClient } from "./clients/db.js"
import { envSetup } from "./utils/envSetup.js"
import Stripe from "stripe"
import bodyParser from "body-parser"
import { setupRoutes } from "./utils/setupRoutes.js"
import { createMailjetClient } from "./clients/mailjet.js"
import { asyncExec } from "./utils/asyncExec.js"
import { createStripeClient } from "./clients/stripe.js"

const MODULE = "main"

const app: Express = express()
let openAIClient: OpenAI
let mailjetClient: Mailjet
let stripeClient: Stripe

async function init() {
    const validEnv = envSetup()
    if (!validEnv) {
        process.exit(1)
    }

    openAIClient = createOpenAIClient()
    mailjetClient = createMailjetClient()
    stripeClient = createStripeClient()
    await createDbClient()

    const env: string = process.env.ENV as string
    const corsWhitelistDev = ["http://localhost:5173", "http://127.0.0.1:5173"]

    app.use(bodyParser.json())
    app.use(express.json({ limit: "2.5mb" }))
    app.use(
        cors({
            origin: env === "PROD" ? "*" : corsWhitelistDev,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }),
    )
    app.use(cookieParser())

    setupRoutes(app)

    const ver = (await asyncExec("git rev-parse HEAD", "Failed to get commitId", false)).slice(0, 7)
    logger(MODULE, `Running version: ${ver}`)
    logger(MODULE, "All set up.", LogType.SUCCESS)
}

export { app, init, openAIClient, mailjetClient }
