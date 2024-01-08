import axios, { AxiosRequestConfig } from "axios"
import { expect } from "chai"
import { User } from "../../models/User.js"
import { testUser, setupTests, teardownTests, registerURL, deleteURL, verifyURL, loginURL } from "../_setup.js"
import { accountSetup, testAxiosRequest } from "../_utils.js"
import { UserAuthTokens } from "../../types/AuthToken.js"
import { IUserPassword } from "../../types/interfaces/IUserPassword.js"

const MODULE = "createUser"

describe("[CORE] Delete an account", function () {

    this.timeout(5000)

    let tokens: UserAuthTokens = { accessToken: "", refreshToken: "" }

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup - register an account", async () => {
        const regReq = () => axios.post(registerURL, testUser)
        const regRes = await testAxiosRequest(MODULE, regReq)
        expect(regRes?.status).to.equal(200)
    })

    it("Should reject request to delete unverified account", async () => {
        const delReq = () => axios.post(deleteURL, testUser)
        const delRes = await testAxiosRequest(MODULE, delReq)
        expect(delRes?.status).to.be.equal(401)
        // will throw unauthorized because we don't even have a JWT yet
    })

    it("Finish setting up the account (verify, login, store auth tokens)", async () => {
        const tokenData = await accountSetup(MODULE, testUser, false)
        expect(tokenData).to.not.be.null
        if (tokenData) { tokens = tokenData }
    })

    it("Should reject request to delete account with invalid credentials", async () => {
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` }
        }
        const invalidDelReqData: IUserPassword = { password: "invalid@Pwd!123" }
        const dReq = () => axios.post(deleteURL, invalidDelReqData, reqConf)
        const dRes = await testAxiosRequest(MODULE, dReq)
        expect(dRes?.status).to.be.equal(401)
    })
    
    it("Delete the account with valid credentials", async () => {
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` }
        }
        const validPwdData: IUserPassword = { password: testUser.password }
        const dReq = () => axios.post(deleteURL, validPwdData, reqConf)
        const dRes = await testAxiosRequest(MODULE, dReq)
        expect(dRes?.status).to.be.equal(200)
    })

})