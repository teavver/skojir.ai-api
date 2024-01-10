import axios from "axios"
import { expect } from "chai"
import { User } from "../../models/User.js"
import { registerURL, verifyURL, setupTests, teardownTests } from "../_setup.js"
import { IUserCredentials } from "../../types/interfaces/IUserCredentials.js"
import { accountSetup, testAxiosRequest } from "../_utils.js"

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

    it("Create an account for dummyUser", async () => {
        await accountSetup(MODULE, userData, true, false, false)
    })

    it("Should reject verify req with invalid code", async () => {

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

    it("dummyUser Account should be verified", async () => {
        const user = await User.findOne({ email: dummyEmail })
        expect(user?.isEmailVerified).to.be.true
    })

    it("Create another account for dummyUser2", async () => {
        const req = () => axios.post(registerURL, userData2)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)

        const user = await User.findOne({ email: dummyEmail2 })
        expect(user?.verificationCode).to.not.be.undefined
        if (user?.verificationCode) oldCode = user?.verificationCode
    })
    
    it("Request a verification code resend", async() => {
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
        if (user?.verificationCode) newCode = user?.verificationCode
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

    it("dummyUser2 record should be updated", async () => {
        const user = await User.findOne({ email: dummyEmail2 })
        expect(user?.isEmailVerified).to.be.true
    })

})
