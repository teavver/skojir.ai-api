import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import { logger } from "./utils.js"
import express, { Request, Response } from "express"

dotenv.config()

const MODULE = "main"

function main() {

    logger(MODULE, "setting up express...")

    const server = express()
    const port = process.env.PORT || 3000

    
    logger(MODULE, "connecting to db...")

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY
    if (!supabaseUrl || !supabaseKey) {
        logger(MODULE, "failed to get Supabase .env keys")
        return
    } 
    const supabase = createClient(supabaseUrl, supabaseKey)

    logger(MODULE, "connected to db")


}

main()