import axios from "axios"
import { expect } from "chai"
import { User } from "../../models/User.js"
import { registerURL, verifyURL, setupTests, teardownTests } from "../_setup.js"
import { IUserCredentials } from "../../types/express/interfaces/IUserCredentials.js"
import { testAxiosRequest } from "../_utils.js"

const MODULE = "verifyUser"

describe("[CORE] Verify an account", function() {

    this.timeout(5000)

    const dummyEmail = "test@example.com"
    const dummyPwd = "Password123!"

    const dummyEmail2 = "hello@there.com"
    const dummyPwd2 = "YhBro!123*"

    const userData: IUserCredentials = {
        email: dummyEmail,
        password: dummyPwd
    }

    const userData2: IUserCredentials = {
        email: dummyEmail2,
        password: dummyPwd2
    }

    let oldCode = ""
    let newCode = ""

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Create an account for dummy user", async () => {
        
        const req = () => axios.post(registerURL, userData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)
    })

    it("Try to verify with invalid code", async () => {

        const invalidVerifyData = {
            email: dummyEmail,
            verificationCode: "123123"
        }

        const req = () => axios.post(verifyURL, invalidVerifyData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(400)

    })

    it("Verify with valid code", async () => {

        const user = await User.findOne({ email: dummyEmail })
        
        const validVerifyData = {
            email: dummyEmail,
            verificationCode: user?.verificationCode
        }

        const req = () => axios.post(verifyURL, validVerifyData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)

    })

    it("Account should be verified", async () => {
        const user = await User.findOne({ email: dummyEmail })
        expect(user?.isEmailVerified).to.be.true
    })

    it("Create another account for dummyUser2", async () => {
        const req = () => axios.post(registerURL, userData2)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)

        const user = await User.findOne({ email: dummyEmail2 })
        expect(user?.verificationCode).to.not.be.undefined
        oldCode = user?.verificationCode!
    })
    
    it("Re-send the verification code", async() => {
        const data = {
            email: dummyEmail2,
            verificationCode: "000000", // value does not matter if 'resend'
            resend: true
        }
        const req = () => axios.post(verifyURL, data)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(200)
        
        const user = await User.findOne({ email: dummyEmail2 })
        expect(user?.verificationCode).to.not.be.undefined
        newCode = user?.verificationCode!
    })

    it("Verify dummyUser2 with the new code", async () => {

        expect(oldCode).to.not.equal(newCode)

        const data = {
            email: dummyEmail2,
            verificationCode: newCode
        }

        const req = () => axios.post(verifyURL, data)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(200)
    })

    it("Check if dummyUser2 record got updated", async () => {
        const user = await User.findOne({ email: dummyEmail2 })
        expect(user?.isEmailVerified).to.be.true
    })

})
