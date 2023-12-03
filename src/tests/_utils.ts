import axios, { AxiosResponse } from "axios"
import { logger, LogType } from "../utils/logger.js"

/**
 * Wrapper for HTTP requests using axios
 * @returns Result of comparison between response status code and `expectedStatusCode`
 */
export async function testAxiosRequest(module: string, axiosReq: Promise<AxiosResponse>, expectedStatusCode: number): Promise<boolean> {
    try {
        const res: AxiosResponse = await axiosReq
        return res.status === expectedStatusCode
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            const res: AxiosResponse | undefined = err.response
            const compRes = res?.status === expectedStatusCode
            if (!compRes) {
                logger(module, `Data: ${JSON.stringify(res?.data)}`, LogType.WARN, true)
                logger(module, `Status: ${res?.status}`, LogType.WARN, true)
            }
            return compRes
        }
        logger(module, `Err: ${err}`, LogType.ERR, true)
        return false
    }
}