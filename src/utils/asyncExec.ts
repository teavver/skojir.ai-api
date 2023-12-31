import { exec as execCallback } from "child_process";
import { logger, LogType } from "./logger.js";
import { promisify } from "util";

const exec = promisify(execCallback)

const MODULE = "utils :: asyncExec"

export async function asyncExec(command: string, errMsg: string) {
    try {
        const { stdout, stderr } = await exec(command)
        logger(MODULE, `Stdout: ${stdout}`, LogType.SERVER)
        logger(MODULE, `Stderr: ${stderr}`, LogType.SERVER)
    } catch (err) {
        logger(MODULE, `${errMsg}. Err: ${err}`, LogType.ERR)
    }
} 