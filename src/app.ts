import { createClient } from "@supabase/supabase-js"
import { logger, LogType } from "./utils/logger.js"
import dotenv from "dotenv"
import express from "express"
import { exit } from "process"
import { OpenAI }  from "openai/index.mjs"
import solverRoute from "./routes/solver.js"

dotenv.config()

const app = express()
const openAIClient = new OpenAI({apiKey: process.env.OPENAI_KEY})

const MODULE = "main"

function main() {

    logger(MODULE, "Setting up...")
    const env = process.env.ENV
    if (!env) {
        logger(MODULE, "No ENV value in .env", LogType.ERR)
        exit(1)
    }

    // https://stackoverflow.com/a/40745569/17721532 <- future nginx solver?
    app.use(express.json({limit: '2.5mb'}))
    app.use('/solve', solverRoute)

    logger(MODULE, "Connecting to db...")
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY
    if (!supabaseUrl || !supabaseKey) {
        logger(MODULE, "Failed to get supabase .env keys", LogType.ERR)
        exit(1)
    }
    
    const db_client = createClient(supabaseUrl, supabaseKey)
    // db_client.

    logger(MODULE, "Connected to db")

}

main()

export { app, openAIClient }