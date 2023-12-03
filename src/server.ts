import { Server } from "net"
import { app, init } from "./main.js"
import { logger, LogType } from "./utils/logger.js"

const MODULE = "server"

export function main(): Server {
    init()
    logger(MODULE, "Starting server...", LogType.SERVER)
    const port = process.env.PORT || 3000
    const server = app.listen(port, () => {
        logger(MODULE, `Express running on port ${port}`, LogType.SERVER)
    })
    return server
}

if (process.env.ENV !== "DEV") {
    main() // autostart only in PROD mode
} 