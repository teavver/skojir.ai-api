import { logger, LogType } from "../utils/logger.js"
import { User } from "../models/User.js"
import { expect } from "chai"
import { init } from "../app.js"
import { hashPwd } from "../utils/hashPwd.js"

const MODULE = "tests :: createUser"

describe('create a dummy User', function () {

  const dummyEmail = "test@example.com" 

  before(async () => {

    await init()

    logger(MODULE, "Setting up test file...")
    const dbCollection = process.env.DB_COLLECTION
    if (!dbCollection) {
        logger(MODULE, "Can't run tests - .env is not set up correctly", LogType.ERR)
        process.exit(1)
    }
    await User.deleteMany({}) // clear the Users before running
    logger(MODULE, "Setup finished.")

  })

    it('Create an account for dummy user', async () => {

        const dummyPwd = "password123"
        const hashedPwd = hashPwd(dummyPwd)

        // console.log(hashedPwd)

        const dummyUser = new User({
            email: dummyEmail,
            password: hashedPwd,
            verificationCode: '123456',
        })

        const savedUser = await dummyUser.save()

        expect(savedUser).to.have.property('email', dummyEmail)
        expect(savedUser).to.have.property('password', hashedPwd)
        expect(savedUser).to.have.property('verificationCode', '123456')
        expect(savedUser).to.have.property('isEmailVerified', false)

    })

    it('Delete the dummy user account', async () => {
        
        const deleteResult = await User.deleteOne({ email: dummyEmail })
        expect(deleteResult.deletedCount).to.equal(1)

        const findResult = await User.findOne({ email: dummyEmail })
        expect(findResult).to.be.null

    })

})