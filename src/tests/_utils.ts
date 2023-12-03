import axios, { AxiosResponse } from "axios"

/**
 * Wrapper for HTTP requests using axios
 * @returns Result of comparison between response status code and `expectedStatusCode`
 */
export async function testAxiosRequest(axiosReq: Promise<AxiosResponse>, expectedStatusCode: number): Promise<boolean> {
    try {
        const res: AxiosResponse = await axiosReq
        return res.status === expectedStatusCode
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            const res: AxiosResponse | undefined = err.response
            // console.log(res?.data)
            // console.log(res?.status)
            return res?.status === expectedStatusCode
        }
        // console.error(err)
        return false
    }
}