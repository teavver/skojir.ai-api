import { logger, LogType } from "./utils/logger.js"
import { createOpenAIClient } from "./clients/openAI.js"
import { createDbClient } from "./clients/db.js"
import express from "express"
import { envSetup } from "./utils/envSetup.js"
import { OpenAI } from "openai"
import solverRoute from "./routes/solver.js"
import statusRoute from "./routes/status.js"
import rootRoute from "./routes/root.js"
import registerRoute from "./routes/user_routes/register.js"
import verifyRoute from "./routes/user_routes/verify.js"
import { createMailjetClient } from "./clients/mailjet.js"
import Mailjet from "node-mailjet"

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

    app.use("/", rootRoute)
    app.use("/status", statusRoute)
    app.use("/solve", solverRoute)
    app.use("/register", registerRoute)
    app.use("/verify", verifyRoute)

    logger(MODULE, "All set up!")
}

export { app, init, openAIClient, mailjetClient }