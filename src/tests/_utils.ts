import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import { logger, LogType } from "../utils/logger.js"

/**
 * Wrapper for HTTP requests using axios
 * @returns Result of comparison between response status code and `expectedStatusCode` and the full Response object
 */
export async function testAxiosRequest(module: string, axiosReq: (config?: AxiosRequestConfig) => Promise<AxiosResponse>, config?: AxiosRequestConfig): Promise<AxiosResponse | undefined> {
    try {
        const res: AxiosResponse = await axiosReq(config)
        return res
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            const res: AxiosResponse | undefined = err.response;
            return res
        }
        logger(module, `Err: ${err}`, LogType.ERR, true)
        return undefined
    }
}