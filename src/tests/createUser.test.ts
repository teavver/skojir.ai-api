import axios from "axios"
import { expect } from "chai"
import { User } from "../models/User.js"
import { setupTests, teardownTests, testBaseURL } from "./_setup.js"
import IUserCredentials from "../types/interfaces/IUserCredentials.js"
import { deriveKey } from "../utils/crypto/pbkdf2.js"
import { testAxiosRequest } from "./_utils.js"

const MODULE = "createUser"

describe("create a dummy User", function () {

    const registerURL = testBaseURL + "/register"
    const dummyEmail = "test@example.com"
    const dummyPwd = "Password123!"

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

    it("Create a valid account for dummy user", async () => {

        const res = await axios.post(registerURL, userData)
        expect(res.status).to.equal(200)

        const newUser = await User.findOne({ email: dummyEmail })
        expect(newUser).to.not.be.null

        const saltedPwd = dummyPwd + newUser!.salt
        const hashedPwd = deriveKey({ password: saltedPwd, salt: newUser!.salt })
        const newUserHashedPwdFind = await User.findOne({ password: hashedPwd })
        expect(newUserHashedPwdFind).to.not.be.null

    })

    it("Should not be able to create duplicate account", async () => {
        const req = axios.post(registerURL, userData)
        const res = await testAxiosRequest(MODULE, req, 409)
        expect(res).to.be.true
    })

    it("Should reject account with invalid email domain", async () => {

        const weirdEmailUser: IUserCredentials = {
            email: "weirdemail@xk.ex",
            password: "Valid!Password123"
        }

        const req = axios.post(registerURL, weirdEmailUser)
        const res = await testAxiosRequest(MODULE, req, 400)
        expect(res).to.be.true

    })

    it("Should reject weak password", async () => {

        const tooWeakUserData: IUserCredentials = {
            email: "user@gmail.com",
            password: "weak1"
        }

        const req = axios.post(registerURL, tooWeakUserData)
        const res = await testAxiosRequest(MODULE, req, 400)
        expect(res).to.be.true

    })


})