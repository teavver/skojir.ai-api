import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { logger } from "./utils.js";
dotenv.config();
const MODULE = "main";
function main() {
    logger(MODULE, "connecting to db...");
    const supabaseUrl = process.env.SUPABASE_URL;
    console.log(supabaseUrl);
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    logger(MODULE, "connected to db");
}
main();
//# sourceMappingURL=index.js.map