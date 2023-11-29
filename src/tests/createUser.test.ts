import { logger, LogType } from "../utils/logger.js"
import { RegisterRequest } from "../types/requests/client/RegisterRequest.js"
import { createUser } from "../services/user_services/createUser.js"
import { User } from "../models/User.js"
import { expect } from "chai"
import { init } from "../main.js"
import { hashPwd } from "../utils/hashPwd.js"
import { generateVerificationCode } from "../utils/generateVerificationCode.js"

const MODULE = "tests :: createUser"

describe('create a dummy User', function () {

    const dummyEmail = "test@example.com" 
    const dummyPwd = "Password123!"
    const hashedPwd = hashPwd(dummyPwd)

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

        const createUserReqData: RegisterRequest = {
            email: dummyEmail,
            password: dummyPwd
        }
        
        const dummyCode = generateVerificationCode()

        // check if service passed
        const res = await createUser(createUserReqData, dummyCode)
        expect(res.err).to.be.false

        // check if new user is in db
        const newUserEmailFind = await User.findOne({ email: dummyEmail })
        const newUserHashedPwdFind = await User.findOne({ password: hashedPwd })
        const newUserVerCode = await User.findOne({ verificationCode: dummyCode })
        expect(newUserEmailFind).to.not.be.null
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