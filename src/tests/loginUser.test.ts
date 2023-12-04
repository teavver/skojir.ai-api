import axios from "axios"
import { expect } from "chai"
import { User } from "../models/User.js"
import { setupTests, teardownTests, testBaseURL } from "./_setup.js"
import IUserCredentials from "../types/interfaces/IUserCredentials.js"
import { testAxiosRequest } from "./_utils.js"

const MODULE = "loginUser"

describe("Login to an account", function () {

    const dummyEmail = "test@example.com"
    const dummyPwd = "Password123!"

    const verifyURL = testBaseURL + "/auth/verify"
    const registerURL = testBaseURL + "/register"
    const loginURL = testBaseURL + "/auth/login"

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

    it("Setup (create and verify account)", async () => {

        const regReq = () => axios.post(registerURL, userData)
        const _res = await testAxiosRequest(MODULE, regReq)
        expect(_res?.status).to.be.equal(200)

        const user = await User.findOne({ email: dummyEmail })

        const validVerifyData = {
            email: dummyEmail,
            verificationCode: user?.verificationCode
        }

        const req = () => axios.post(verifyURL, validVerifyData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(200)

    })

    it("Try to log in with invalid credentials", async () => {

        const invalidUserData: IUserCredentials = {
            email: userData.email,
            password: userData.password + "aaa"
        }

        const req = () => axios.post(loginURL, invalidUserData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(400)

    })

    it("Try to log in with valid credentials but invalid request body", async () => {

        const invalidUserData = {
            email: userData.email,
            password: userData.password + "aaa",
            someOtherField: "why"
        }

        const req = () => axios.post(loginURL, invalidUserData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(400)

    })

    it("Log in with valid credentials", async () => {

        const req = () => axios.post(loginURL, userData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(200)
        
    })



})