import axios, { AxiosRequestConfig } from "axios"
import { expect } from "chai"
import { User } from "../models/User.js"
import { setupTests, teardownTests, testBaseURL } from "./_setup.js"
import IUserCredentials from "../types/interfaces/IUserCredentials.js"
import { testAxiosRequest } from "./_utils.js"

const MODULE = "createUser"

describe("Delete an account", function () {

    this.timeout(5000)

    const registerURL = testBaseURL + "/register"
    const verifyURL = testBaseURL + "/auth/verify"
    const loginURL = testBaseURL + "/auth/login"
    const deleteURL = testBaseURL + "/delete"

    const dummyEmail = "user@example.com"
    const dummyPwd = "Password123!"

    let accessToken: string, refreshToken: string

    const userData: IUserCredentials = {
        email: dummyEmail,
        password: dummyPwd
    }

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup - register an account", async () => {

        // register
        const regReq = () => axios.post(registerURL, userData)
        const regRes = await testAxiosRequest(MODULE, regReq)
        expect(regRes?.status).to.equal(200)

    })

    it("Try to delete unverified account", async () => {
        const delReq = () => axios.post(deleteURL, userData)
        const delRes = await testAxiosRequest(MODULE, delReq)
        expect(delRes?.status).to.be.equal(401)
        // will throw unauthorized because we don't even have a JWT yet
    })

    it("Setup - Verify, login, store tokens", async () => {

        // verify
        const user = await User.findOne({ email: dummyEmail })

        const verifyData = { email: dummyEmail, verificationCode: user?.verificationCode }
        const req = () => axios.post(verifyURL, verifyData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)

        // login
        const loginReq = () => axios.post(loginURL, userData)
        const loginRes = await testAxiosRequest(MODULE, loginReq)
        expect(loginRes?.status).to.be.equal(200)

        // store the tokens
        accessToken = loginRes?.data.tokens.accessToken
        refreshToken = loginRes?.data.tokens.refreshToken
    })

    it("Try to delete the account with invalid credentials", async () => {
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${accessToken}` }
        }
        const invalidDelReqData = { email: dummyEmail, password: "invalid@Pwd!123" }
        const dReq = () => axios.post(deleteURL, invalidDelReqData, reqConf)
        const dRes = await testAxiosRequest(MODULE, dReq)
        expect(dRes?.status).to.be.equal(401)
    })
    
    
    it("Delete the account with valid credentials", async () => {
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${accessToken}` }
        }
        const dReq = () => axios.post(deleteURL, userData, reqConf)
        const dRes = await testAxiosRequest(MODULE, dReq)
        expect(dRes?.status).to.be.equal(200)
    })

})