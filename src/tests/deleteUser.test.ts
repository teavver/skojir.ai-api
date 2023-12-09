import axios, { AxiosRequestConfig } from "axios"
import { expect } from "chai"
import { User } from "../models/User.js"
import { testUser, setupTests, teardownTests, registerURL, deleteURL, verifyURL, loginURL } from "./_setup.js"
import { testAxiosRequest } from "./_utils.js"
import { UserAuthTokens } from "../types/AuthToken.js"

const MODULE = "createUser"

describe("Delete an account", function () {

    this.timeout(5000)

    let tokens: UserAuthTokens = { accessToken: "", refreshToken: "" }

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup - register an account", async () => {

        // register
        const regReq = () => axios.post(registerURL, testUser)
        const regRes = await testAxiosRequest(MODULE, regReq)
        expect(regRes?.status).to.equal(200)

    })

    it("Try to delete unverified account", async () => {
        const delReq = () => axios.post(deleteURL, testUser)
        const delRes = await testAxiosRequest(MODULE, delReq)
        expect(delRes?.status).to.be.equal(401)
        // will throw unauthorized because we don't even have a JWT yet
    })

    it("Setup - Verify, login, store tokens", async () => {

        // verify
        const user = await User.findOne({ email: testUser.email })

        const verifyData = { email: testUser.email, verificationCode: user?.verificationCode }
        const req = () => axios.post(verifyURL, verifyData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)

        // login
        const loginReq = () => axios.post(loginURL, testUser)
        const loginRes = await testAxiosRequest(MODULE, loginReq)
        expect(loginRes?.status).to.be.equal(200)
        
        // store the tokens
        console.log({testUser})
        console.log(loginRes?.data.tokens)
        tokens.accessToken = loginRes?.data.tokens.accessToken
        tokens.refreshToken = loginRes?.data.tokens.refreshToken
    })

    it("Try to delete the account with invalid credentials", async () => {
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` }
        }
        const invalidDelReqData = { email: testUser.email, password: "invalid@Pwd!123" }
        const dReq = () => axios.post(deleteURL, invalidDelReqData, reqConf)
        const dRes = await testAxiosRequest(MODULE, dReq)
        expect(dRes?.status).to.be.equal(401)
    })
    
    
    it("Delete the account with valid credentials", async () => {
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` }
        }
        console.log({testUser})
        console.log(tokens.accessToken)
        const dReq = () => axios.post(deleteURL, testUser, reqConf)
        const dRes = await testAxiosRequest(MODULE, dReq)
        console.log(dRes?.data)
        expect(dRes?.status).to.be.equal(200)
    })

})