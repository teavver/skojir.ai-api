import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import { logger, LogType } from "../utils/logger.js"

/**
 * Wrapper for HTTP requests using axios
 * @returns Result of comparison between response status code and `expectedStatusCode` and the full Response object
 */
// export async function testAxiosRequest(module: string, axiosReq: () => Promise<AxiosResponse>): Promise<AxiosResponse | undefined> {
//     try {
//         const res: AxiosResponse = await axiosReq()
//         return res
//     } catch (err: any) {
//         if (axios.isAxiosError(err)) {
//             const res: AxiosResponse | undefined = err.response
//             return res
//         }
//         logger(module, `Err: ${err}`, LogType.ERR, true)
//         return undefined
//     }
// }


export async function testAxiosRequest(
    module: string, 
    axiosReq: (config?: AxiosRequestConfig) => Promise<AxiosResponse>, 
    config?: AxiosRequestConfig // Optional parameter
): Promise<AxiosResponse | undefined> {
    try {
        const res: AxiosResponse = await axiosReq(config) // Pass the config to axios request
        return res;
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            const res: AxiosResponse | undefined = err.response;
            return res;
        }
        logger(module, `Err: ${err}`, LogType.ERR, true);
        return undefined;
    }
}