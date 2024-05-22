import axios from "axios"
import { AxiosRequestConfig } from "axios"
import { expect } from "chai"
import { testUser, setupTests, teardownTests, emailChangeURL, testUser2, pwdChangeOTPURL } from "../_setup.js"
import { accountSetup, testAxiosRequest } from "../_utils.js"
import { UserAuthTokens } from "../../types/AuthToken.js"
import { User } from "../../models/User.js"

const MODULE = "pwdChangeOTP + pwdChange"

describe("[CORE] pwdChange (OTP + change)", function () {
    this.timeout(5000)

    let tokens: UserAuthTokens = {
        accessToken: "",
        refreshToken: "",
        membershipToken: "",
    }

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup accounts for testUsers (register, verify, login)", async () => {
        const tokenData = await accountSetup(MODULE, testUser)
        await accountSetup(MODULE, testUser2)
        expect(tokenData).to.not.be.null
        if (tokenData) {
            tokens = tokenData
        }
    })

    it("Request an OTP code from the /pwd-change-otp endpoint", async () => {
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
        const req = () => axios.get(pwdChangeOTPURL, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        // const userData = await User.findOne({ email: testUser.email })
        // console.log('t ', userData)
        expect(res?.status).to.equal(200)
    })

    // it("Should reject request to change email with invalid OTP code", async () => {
    //     const newEmail = "test2@example.com"
    //     const reqData = {
    //         email: newEmail,
    //         otp: "100200",
    //     }
    //     const reqConf: AxiosRequestConfig = {
    //         headers: { Authorization: `Bearer ${tokens.accessToken}` },
    //     }
    //     const req = () => axios.post(emailChangeURL, reqData, reqConf)
    //     const res = await testAxiosRequest(MODULE, req)
    //     expect(res?.status).to.equal(401)
    // })

    // it("Should reject request to change email to an already existing account", async () => {
    //     const user = await User.findOne({ email: testUser.email })
    //     const newEmail = testUser2.email
    //     const reqData = {
    //         email: newEmail,
    //         otp: user!.emailOTP,
    //     }
    //     const reqConf: AxiosRequestConfig = {
    //         headers: { Authorization: `Bearer ${tokens.accessToken}` },
    //     }
    //     const req = () => axios.post(emailChangeURL, reqData, reqConf)
    //     const res = await testAxiosRequest(MODULE, req)
    //     expect(res?.status).to.equal(409)
    // })

    // it("Change the email with valid OTP", async () => {
    //     const newEmail = "test2@example.com"
    //     const reqConf: AxiosRequestConfig = {
    //         headers: { Authorization: `Bearer ${tokens.accessToken}` },
    //     }
    //     const user = await User.findOne({ email: testUser.email })
    //     const reqData = {
    //         email: newEmail,
    //         otp: user!.emailOTP,
    //     }
    //     const req = () => axios.post(emailChangeURL, reqData, reqConf)
    //     const res = await testAxiosRequest(MODULE, req)
    //     expect(res?.status).to.equal(200)
    // })
})
