import * as sinon from 'sinon';
import axios from "axios"
import { AxiosRequestConfig } from "axios"
import { expect } from "chai"
import { testUser, setupTests, teardownTests, emailChangeURL, testUser2, pwdChangeOTPURL, pwdChangeURL } from "../_setup.js"
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

    let tokens2: UserAuthTokens = {
        accessToken: "",
        refreshToken: "",
        membershipToken: "",
    }

    let newStrongPwd = "@Some$Really0732strong0Pwd"
    let newWeakPwd = "@weak123weak"

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup accounts for testUsers (register, verify, login)", async () => {
        const tokenData = await accountSetup(MODULE, testUser)
        const tokenData2 = await accountSetup(MODULE, testUser2)
        expect(tokenData).to.not.be.null
        expect(tokenData2).to.not.be.null
        if (tokenData && tokenData2) {
            tokens = tokenData
            tokens2 = tokenData2
        }
    })

    it("Request an OTP code from the /pwd-change-otp endpoint", async () => {
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
        const req = () => axios.get(pwdChangeOTPURL, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)
    })

    it("Should reject request to change password (invalid OTP code)", async () => {
        const reqData = {
            otp: "100200",
            newPwd: newStrongPwd
        }
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
        const req = () => axios.post(pwdChangeURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(401)
    })

    it("Should reject request to change pwd (same pwds)", async () => {
        const user = await User.findOne({ email: testUser.email })
        const reqData = {
            otp: user!.pwdChangeOTP,
            newPwd: testUser.password // Same one that was used in account-setup in _setup
        }
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
        const req = () => axios.post(pwdChangeURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(409)

    })

    it("Should reject request to change pwd (missing/wrong keys in req body)", async () => {
        const user = await User.findOne({ email: testUser.email })
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
        // Missing  'otp' key in body
        const reqData = {
            newPwd: newStrongPwd
        }
        const req = () => axios.post(emailChangeURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(400)

        // Missing 'newPwd' key in body
        const reqData2 = {
            otp: user?.pwdChangeOTP,
            newPwd: newStrongPwd
        }
        const req2 = () => axios.post(emailChangeURL, reqData2, reqConf)
        const res2 = await testAxiosRequest(MODULE, req2)
        expect(res2?.status).to.equal(400)

        // Attached 'email' key in body for some reason
        const reqData3 = {
            newPwd: newStrongPwd
        }
        const req3 = () => axios.post(emailChangeURL, reqData3, reqConf)
        const res3 = await testAxiosRequest(MODULE, req3)
        expect(res3?.status).to.equal(400)
    })

    it("Should reject new password (too weak)", async () => {
        const user = await User.findOne({ email: testUser.email })
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
        const reqData = {
            otp: user!.pwdChangeOTP,
            newPwd: newWeakPwd
        }

        const req = () => axios.post(pwdChangeURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(400)
    })


    it("Should reject a password change before requesting OTP (wrong order)", async () => {
        const user2 = await User.findOne({ email: testUser2.email })
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens2.accessToken}` },
        }
        const reqData = {
            otp: user2!.pwdChangeOTP, // Going to be undefined, so we get 400
            newPwd: newStrongPwd
        }

        // User2 never requested a pwdChange OTP code
        const req = () => axios.post(pwdChangeURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(400)
    })

    it("Should reject expired OTP", async () => {
        const now = Date.now()
        const clock = sinon.useFakeTimers(now)
        try {
            const reqConf: AxiosRequestConfig = {
                headers: { Authorization: `Bearer ${tokens2.accessToken}` },
            }
            const otpReq = () => axios.get(pwdChangeOTPURL, reqConf)
            const otpRes = await testAxiosRequest(MODULE, otpReq)
            expect(otpRes?.status).to.equal(200)
            const user2 = await User.findOne({ email: testUser2.email })
            const otpCode = user2?.pwdChangeOTP
            expect(otpCode).to.not.be.undefined

            const reqData = {
                otp: otpCode,
                newPwd: newStrongPwd,
            }

            clock.tick(45 * 60 * 1000); // Pass 45 mins
            const req = () => axios.post(pwdChangeURL, reqData, reqConf)
            const res = await testAxiosRequest(MODULE, req)
            expect(res?.status).to.equal(400)
            const errMsg = "Your email change OTP code expired."
            expect(res?.data.message).to.equal(errMsg)
        } finally {
            clock.restore()
        }
    })

    it("Change the password with a valid OTP code", async () => {
        const user = await User.findOne({ email: testUser.email })
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
        const reqData = {
            otp: user!.pwdChangeOTP,
            newPwd: newStrongPwd
        }

        const req = () => axios.post(pwdChangeURL, reqData, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)

    })

})
