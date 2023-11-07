import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

function main() {
    console.log("connect to db")

    console.log(process.env.TEST)

    // const supabaseUrl = 'https://gdjgbelgtbrpdottixno.supabase.co'
    const supabaseUrl = process.env.SUPABASE_URL
    console.log(supabaseUrl)
    const supabaseKey = process.env.SUPABASE_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('done')


}

main()