import axios from "axios"
import { expect } from "chai"
import { testUser, setupTests, teardownTests, loginURL } from "../_setup.js"
import { IUserCredentials } from "../../types/interfaces/IUserCredentials.js"
import { accountSetup, testAxiosRequest } from "../_utils.js"

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
        await accountSetup(MODULE, testUser, true, true, false)
    })

    it("Should reject login req with invalid credentials", async () => {

        const invalidUserData: IUserCredentials = {
            email: testUser.email,
            password: testUser.password + "aaa"
        }

        const req = () => axios.post(loginURL, invalidUserData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(400)

    })

    it("Should reject login req with valid credentials but invalid request body", async () => {

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