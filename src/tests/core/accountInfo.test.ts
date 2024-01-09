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

    it("Get account info", async () => {
        const reqConf: AxiosRequestConfig = { headers: { Authorization: `Bearer ${tokens.accessToken}` }}
        const req = () => axios.get(accountInfoURL, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        console.log('========================================')
        console.log(res?.data)
        console.log('========================================')
        expect(res?.status).to.equal(200)
    })
    
})