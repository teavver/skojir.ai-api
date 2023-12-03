import axios from "axios"
import { expect } from "chai"
import { User } from "../models/User.js"
import { setupTests, teardownTests, testBaseURL } from "./_setup.js"
import IUserCredentials from "../types/interfaces/IUserCredentials.js"
import { deriveKey } from "../utils/crypto/pbkdf2.js"

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

    it("Create an account for dummy user", async () => {

        
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

        try {
            const res = await axios.post(registerURL)
            expect.fail("This request should've failed")
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const res = err.response
                expect(res).to.exist
                console.log(res?.data)
            }
        }

    })


})