import { exec as execCallback } from "child_process";
import { logger, LogType } from "./logger.js";
import { promisify } from "util";

const exec = promisify(execCallback)

const MODULE = "utils :: asyncExec"

export async function asyncExec(command: string, errMsg: string, log: boolean = true): Promise<string> {
    try {
        const { stdout, stderr } = await exec(command)
        log && stdout && logger(MODULE, `Stdout: ${stdout}`, LogType.SERVER)
        log && stderr && logger(MODULE, `Stderr: ${stderr}`, LogType.SERVER)
        return stdout
    } catch (err) {
        logger(MODULE, `${errMsg}. Err: ${err}`, LogType.ERR)
        return ""
    }
} 