import axios from "axios"
import { expect } from "chai"
import { User } from "../models/User.js"
import { testBaseURL, setupTests, teardownTests } from "./_setup.js"
import IUserCredentials from "../types/interfaces/IUserCredentials.js"
import { testAxiosRequest } from "./_utils.js"

const MODULE = "verifyUser"

describe("create and verify a dummy User", function() {

    const dummyEmail = "test@example.com"
    const dummyPwd = "Password123!"

    const verifyURL = testBaseURL + "/auth/verify"
    const registerURL = testBaseURL + "/register"

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

    it("Create an account for dummy user", async () => {
        
        const req = axios.post(registerURL, userData)
        const res = await testAxiosRequest(MODULE, req, 200)
        expect(res).to.be.true
    })

    it("Try to verify with invalid code", async () => {

        const invalidVerifyData = {
            email: dummyEmail,
            verificationCode: "123123"
        }

        const req = axios.post(verifyURL, invalidVerifyData)
        const res = await testAxiosRequest(MODULE, req, 400)
        expect(res).to.be.true

    })

    it("Verify with valid code", async () => {

        const user = await User.findOne({ email: dummyEmail })
        
        const validVerifyData = {
            email: dummyEmail,
            verificationCode: user?.verificationCode
        }

        const req = axios.post(verifyURL, validVerifyData)
        const res = await testAxiosRequest(MODULE, req, 200)
        expect(res).to.be.true

    })

    it("Account should be verified", async () => {
        const user = await User.findOne({ email: dummyEmail })
        expect(user?.isEmailVerified).to.be.true
    })

})
