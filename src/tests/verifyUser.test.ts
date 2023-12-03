import axios from "axios"
import { expect } from "chai"
import { User } from "../models/User.js"
import { testBaseURL, setupTests, teardownTests } from "./_setup.js"
import IUserCredentials from "../types/interfaces/IUserCredentials.js"

const MODULE = "verifyUser"

describe("create and verify a dummy User", function() {

    const dummyEmail = "test@example.com"
    const dummyPwd = "Password123!"
    const verifyURL = testBaseURL + "/auth/verify"

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
        const registerURL = testBaseURL + "/register"
        const res = await axios.post(registerURL, userData)
        expect(res.status).to.equal(200)
    })

    it("Try to verify with invalid code", async () => {

        const invalidVerifyData = {
            email: dummyEmail,
            verificationCode: "123123"
        }

        try {
            await axios.post(verifyURL, invalidVerifyData)
            expect.fail("This request should've failed")
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const res = err.response
                expect(res).to.exist
                expect(res?.status).to.equal(401) // invalid code
            }
        }

    })

    it("Verify with valid code", async () => {

        const user = await User.findOne({ email: dummyEmail })
        
        const validVerifyData = {
            email: dummyEmail,
            verificationCode: user?.verificationCode
        }

        const vres = await axios.post(verifyURL, validVerifyData)
        expect(vres.status).to.equal(200)

    })


    it("Account should be verified", async () => {
        const user = await User.findOne({ email: dummyEmail })
        expect(user?.isEmailVerified).to.be.true
    })

})
