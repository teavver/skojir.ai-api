import axios from "axios"
import { AxiosRequestConfig } from "axios"
import { expect } from "chai"
import { testUser, setupTests, teardownTests, emailOTPURL, emailChangeURL } from "./_setup.js"
import { fullUserSetup, testAxiosRequest } from "./_utils.js"
import { UserAuthTokens } from "../types/AuthToken.js"
import { User } from "../models/User.js"

const MODULE = "emailOTP + emailChange"

describe("Email (OTP + change)", function () {

    this.timeout(5000)

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
        const req = () => axios.post(emailOTPURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)
    })

    it("Try to change email with invalid OTP code", async () => {
        const reqData = {
            email: testUser.email,
            verificationCode: "100200"
        }
        const reqConf: AxiosRequestConfig = { headers: { Authorization: `Bearer ${tokens.accessToken}` }}
        const req = () => axios.post(emailChangeURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(401)
    })

    it("Finish changing email with valid OTP", async () => {
        const reqConf: AxiosRequestConfig = { headers: { Authorization: `Bearer ${tokens.accessToken}` }}
        const user = await User.findOne({ email: testUser.email })
        const reqData = {
            email: testUser.email,
            verificationCode: user?.verificationCode
        }
        const req = () => axios.post(emailChangeURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)
    })

})