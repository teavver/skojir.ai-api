export enum LogType {
    SUCCESS = "\x1b[32m", // Green
    SERVER = "\x1b[35m", // Magenta
    NORMAL = "\x1b[0m", // Default terminal color
    WARN = "\x1b[33m", // Yellow
    ERR = "\x1b[31m", // Red
}

export function logger(
    module: string,
    msg: string,
    logType: LogType = LogType.NORMAL,
    overrideLog: boolean = false,
    time: boolean = true,
) {
    const log = +process.env.LOG!
    const overrideSetting = overrideLog || log
    const timestamp = time ? `[${new Date().toLocaleTimeString()}] ` : ""
    overrideSetting && console.log(`${logType}${timestamp}[${module}]: ${msg}${LogType.NORMAL}`)
}
