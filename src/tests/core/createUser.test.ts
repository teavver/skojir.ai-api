import axios from "axios"
import { expect } from "chai"
import { User } from "../../models/User.js"
import { testUser, setupTests, teardownTests, registerURL } from "../_setup.js"
import { deriveKey } from "../../utils/crypto/pbkdf2.js"
import { testAxiosRequest } from "../_utils.js"
import { IUserCredentials } from "../../types/interfaces/IUserCredentials.js"

const MODULE = "createUser"

describe("[CORE] Create an account", function () {

    this.timeout(5000)

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })
    
    it("Create the dummy User account", async () => {
        const req = () => axios.post(registerURL, testUser)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(201)

        const newUser = await User.findOne({ email: testUser.email })
        expect(newUser).to.exist

        const saltedPwd = testUser.password + newUser?.salt
        const hashedPwd = deriveKey({ password: saltedPwd, salt: newUser?.salt as string })

        const newUserHashedPwdFind = await User.findOne({ password: hashedPwd })
        expect(newUserHashedPwdFind).to.exist
        expect(newUserHashedPwdFind?.password).to.be.equal(hashedPwd)
    })

    it("Should not be able to create duplicate account", async () => {
        const req = () => axios.post(registerURL, testUser)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(409)
    })

    it("Should reject account with invalid email domain", async () => {

        const weirdEmailUser: IUserCredentials = {
            email: "weirdemail@xk.ex",
            password: "Valid!Password123"
        }

        const req = () => axios.post(registerURL, weirdEmailUser)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(400)

    })

    it("Should reject weak password", async () => {

        const tooWeakUserData: IUserCredentials = {
            email: "user@gmail.com",
            password: "weak1"
        }

        const req = () => axios.post(registerURL, tooWeakUserData)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(400)

    })

})