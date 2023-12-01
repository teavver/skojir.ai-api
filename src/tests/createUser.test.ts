import { logger, LogType } from "../utils/logger.js"
import { UserCredentialsRequest } from "../types/requests/client/UserCredentialsRequest.js"
import { createUser } from "../services/user_services/createUser.js"
import { User } from "../models/User.js"
import { expect } from "chai"
import { init } from "../main.js"
import { generateVerificationCode } from "../utils/crypto/genVerificationCode.js"
import { deriveKey } from "../utils/crypto/pbkdf2.js"

const MODULE = "tests :: createUser"

describe('create a dummy User', function () {

    const dummyEmail = "test@example.com"
    const dummyPwd = "Password123!"

    before(async () => {

        await init()

        logger(MODULE, "Setting up test file...")
        const dbCollection = process.env.DB_COLLECTION
        if (!dbCollection) {
            logger(MODULE, "Can't run tests - .env is not set up correctly", LogType.ERR)
            process.exit(1)
        }
        await User.deleteMany({}) // clear the Users collection before running
        logger(MODULE, "Setup finished.")

    })

    it('Create an account for dummy user', async () => {

        const createUserReqData: UserCredentialsRequest = {
            email: dummyEmail,
            password: dummyPwd
        }
        
        const dummyCode = generateVerificationCode()

        // check if service passed
        const res = await createUser(createUserReqData, dummyCode)
        expect(res.err).to.be.false

        // check if new user is in db
        const newUser = await User.findOne({ email: dummyEmail })
        expect(newUser).to.not.be.null

        // compute and compare passwords
        const saltedPwd = dummyPwd + newUser!.salt
        const hashedPwd = deriveKey({ password: saltedPwd, salt: newUser!.salt })

        // verify data
        const newUserHashedPwdFind = await User.findOne({ password: hashedPwd })
        const newUserVerCode = await User.findOne({ verificationCode: dummyCode })
        expect(newUserHashedPwdFind).to.not.be.null
        expect(newUserVerCode).to.not.be.null

    })

    // cleanup
    it('Delete the dummy user account', async () => {
        const deleteResult = await User.deleteOne({ email: dummyEmail })
        expect(deleteResult.deletedCount).to.equal(1)
        const findResult = await User.findOne({ email: dummyEmail })
        expect(findResult).to.be.null
    })

})