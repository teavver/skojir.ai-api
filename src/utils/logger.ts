export enum LogType {
    NORMAL = "\x1b[0m", // default term color
    WARN = "\x1b[33m", // yellow
    ERR = "\x1b[31m", // red
}

export function logger(module: string, msg: string, logType: LogType = LogType.NORMAL, time: boolean = true): void {
    const timestamp = time ? `[${new Date().toLocaleTimeString()}] ` : ""
    console.log(`${logType}${timestamp}[${module}]: ${msg}${LogType.NORMAL}`)
}