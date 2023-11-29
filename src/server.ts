import { app, init } from "./main.js"
import { logger, LogType } from "./utils/logger.js"

const MODULE = "server"

init()
logger(MODULE, "Starting server...")
const port = process.env.PORT || 3000
app.listen(port, () => {
    logger(MODULE, `Express running on port ${port}`)
})