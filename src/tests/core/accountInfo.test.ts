import { expect } from "chai"
import axios, { AxiosRequestConfig } from "axios"
import { accountSetup, testAxiosRequest } from "../_utils.js"
import { testUser, setupTests, teardownTests, accountInfoURL } from "../_setup.js"
import { UserAuthTokens } from "../../types/AuthToken.js"
import { AccountInfoResponse } from "../../types/responses/AccountInfoResponse.js"

const MODULE = "accountInfo"

describe("[CORE] Get account data", function () {

    this.timeout(5000)
    
    let tokens: UserAuthTokens = { accessToken: "", refreshToken: "" }

    before(async () => {
        await setupTests(MODULE)
    })
    
    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup (create and verify account)", async () => {
        const tokenData = await accountSetup(MODULE, testUser)
        expect(tokenData).to.not.be.null
        if (tokenData) { tokens = tokenData }
    })

    it("Should reject get account info w/o JWT", async () => {
        const req = () => axios.get(accountInfoURL)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(401)
    })

    it("Get account info", async () => {
        const reqConf: AxiosRequestConfig = { headers: { Authorization: `Bearer ${tokens.accessToken}` }}
        const req = () => axios.get(accountInfoURL, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        // console.log('========================================')
        // console.log(res?.status)
        // console.log(res?.data.message)
        // console.log(res?.data.user)
        // console.log('========================================')
        expect(res?.status).to.equal(200)
        expect(res?.data.user.email).to.equal(testUser.email)
    })
    
})