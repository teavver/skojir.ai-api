import { expect } from "chai"
import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import { registerURL, verifyURL, loginURL } from "./_setup.js"
import { logger, LogType } from "../utils/logger.js"
import { UserAuthTokens } from "../types/AuthToken.js"
import { IUserCredentials, IUserCredentialsExt } from "../types/interfaces/IUserCredentials.js"
import { User } from "../models/User.js"
import { v4 as uuidv4 } from 'uuid'

/**
 * Wrapper for HTTP requests using axios
 * @returns Result of comparison between response status code and `expectedStatusCode` and the full Response object
 */
export async function testAxiosRequest(module: string, axiosReq: (config?: AxiosRequestConfig) => Promise<AxiosResponse>, config?: AxiosRequestConfig): Promise<AxiosResponse | undefined> {
    try {
        const res: AxiosResponse = await axiosReq(config)
        return res
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const res: AxiosResponse | undefined = err.response
            return res
        }
        logger(module, `Err: ${err}`, LogType.ERR, true)
        return undefined
    }
}

/**
 * Shortcut function for an account setup
 * This includes (by default): creating an account, verifying it and logging in
 * Returns userAuthTokens object on success
 */
export async function accountSetup(module: string, userData: IUserCredentials, register: boolean = true, verify: boolean = true, login: boolean = true): Promise<UserAuthTokens | void> {

    if (register) {
        const regReq = () => axios.post(registerURL, userData)
        const regRes = await testAxiosRequest(module, regReq)
        expect(regRes?.status).to.equal(200)
    }

    if (verify) {
        const user = await User.findOne({ email: userData.email })
        const verifyData = { email: userData.email, verificationCode: user?.verificationCode }
        const req = () => axios.post(verifyURL, verifyData)
        const res = await testAxiosRequest(module, req)
        expect(res?.status).to.equal(200)
    }

    if (login) {

        const loginData: IUserCredentialsExt = {
            email: userData.email,
            password: userData.password,
            deviceId: uuidv4()
        }

        const loginReq = () => axios.post(loginURL, loginData)
        const loginRes = await testAxiosRequest(module, loginReq)
        expect(loginRes?.status).to.equal(200)

        const cookies = loginRes?.headers['set-cookie']
        expect(cookies).to.be.an('array')

        let refreshTokenFound = cookies?.some(cookie => cookie.startsWith('refreshToken=') && cookie.includes('HttpOnly'))
        expect(refreshTokenFound).to.be.true
        
        const accessToken = loginRes?.data.accessToken
        expect(accessToken).to.not.be.null

        return {
            accessToken: accessToken,
            refreshToken: "", // returned as httpOnly cookie
            membershipToken: ""
        }
    }
}