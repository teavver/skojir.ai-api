import axios from "axios"
import { expect } from "chai"
import { User } from "../../models/User.js"
import { testUser, setupTests, teardownTests, registerURL, verifyURL, loginURL } from "../_setup.js"
import { IUserCredentials } from "../../types/interfaces/IUserCredentials.js"
import { testAxiosRequest } from "../_utils.js"

const MODULE = "loginUser"

describe("[CORE] Login to an account", function () {

    this.timeout(5000)

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup (create and verify account)", async () => {

        const regReq = () => axios.post(registerURL, testUser)
        const _res = await testAxiosRequest(MODULE, regReq)
        expect(_res?.status).to.be.equal(200)

        const user = await User.findOne({ email: testUser.email })

        const validVerifyData = {
            email: testUser.email,
            verificationCode: user?.verificationCode
        }

        const req = () => axios.post(verifyURL, validVerifyData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(200)

    })

    it("Try to log in with invalid credentials", async () => {

        const invalidUserData: IUserCredentials = {
            email: testUser.email,
            password: testUser.password + "aaa"
        }

        const req = () => axios.post(loginURL, invalidUserData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(400)

    })

    it("Try to log in with valid credentials but invalid request body", async () => {

        const invalidUserData = {
            email: testUser.email,
            password: testUser.password + "aaa",
            someOtherField: "why"
        }

        const req = () => axios.post(loginURL, invalidUserData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(400)

    })

    it("Log in with valid credentials", async () => {

        const req = () => axios.post(loginURL, testUser)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(200)
        
    })



})