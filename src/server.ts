import { app } from "./app.js"
import { logger, LogType } from "./utils/logger.js"

const MODULE = "server"

logger(MODULE, "starting express...")
const port = process.env.PORT || 3000
app.listen(port, () => {
    logger(MODULE, `express running on port ${port}`)
})
