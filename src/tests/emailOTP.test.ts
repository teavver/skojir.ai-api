import axios from "axios"
import { AxiosRequestConfig } from "axios"
import { expect } from "chai"
import { testUser, setupTests, teardownTests, emailChangeOTPURL } from "./_setup.js"
import { fullUserSetup, testAxiosRequest } from "./_utils.js"
import { UserAuthTokens } from "../types/AuthToken.js"

const MODULE = "emailChange"

describe("Email change OTP service", function () {

    let tokens: UserAuthTokens = { accessToken: "", refreshToken: "" }

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup a user (register, verify, login)", async () => {
        tokens = await fullUserSetup(MODULE, testUser)
    })

    it("Request OTP from /email-otp endpoint", async () => {
        const reqData = { email: testUser.email }
        const reqConf: AxiosRequestConfig = { headers: { Authorization: `Bearer ${tokens.accessToken}` }}
        const req = () => axios.post(emailChangeOTPURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)
    })

})