import path from "path"
import { appendFile, stat, rename } from "fs"

export enum LogType {
    SUCCESS = "\x1b[32m", // Green
    SERVER = "\x1b[35m", // Magenta
    NORMAL = "\x1b[0m", // Default terminal color
    WARN = "\x1b[33m", // Yellow
    ERR = "\x1b[31m", // Red
}

const __dirname = process.cwd()
const MODULE = "utils :: logger"
const LOG_FILE_PATH = path.join(__dirname, "app.log")
const MAX_LOG_FILE_SIZE = 1024 * 10 // 16MB

export function logger(
    module: string,
    msg: string,
    logType: LogType = LogType.NORMAL,
    overrideLog: boolean = false,
    time: boolean = true,
) {
    const logMode = +process.env.LOG! // log modes explained in README
    const overrideSetting = overrideLog || logMode
    const timestamp = time ? `[${new Date().toLocaleTimeString()}] ` : ""
    const logContentRaw = `${timestamp}[${module}]: ${msg}`
    overrideSetting && console.log(`${logType}${logContentRaw}${LogType.NORMAL}`)
    if (logMode === 2) {
        writeToLogFile(logContentRaw)
        rotateLogFile()
    }
}

function writeToLogFile(contents: string) {
    appendFile(LOG_FILE_PATH, contents + "\r\n", (err) => {
        if (err) logger(MODULE, `Err while saving logfile: ${err}`, LogType.ERR)
    })
}

function rotateLogFile() {
    stat(LOG_FILE_PATH, (err, stats) => {
        if (err) {
            logger(MODULE, `Err while rotating logfile: ${err}`, LogType.ERR)
            return
        }

        if (stats.size >= MAX_LOG_FILE_SIZE) {
            const backupFileName = path.join(__dirname, `app (${Date.now()}).log`)
            rename(LOG_FILE_PATH, backupFileName, (err) => {
                if (err) {
                    logger(MODULE, `Err while renaming logfile: ${err}`)
                } else {
                    logger(MODULE, "Logfile rotated")
                }
            })
        }
    })
}