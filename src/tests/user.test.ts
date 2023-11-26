import { logger, LogType } from "../utils/logger.js"
import { User } from "../models/User.js"
import { expect } from "chai"
import { init } from "../app.js"

const MODULE = "tests :: createUser"

describe('create a dummy User', function () {

  this.timeout(5000)

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

        const dummyUser = new User({
            email: 'test@example.com',
            password: 'password123',
            verificationCode: '123456',
        })

        const savedUser = await dummyUser.save()

        expect(savedUser).to.have.property('email', 'test@example.com')
        expect(savedUser).to.have.property('password', 'password123')
        expect(savedUser).to.have.property('verificationCode', '123456')
        expect(savedUser).to.have.property('isEmailVerified', false)

    })

    it('Delete the dummy user account', async () => {
        
        const targetEmail = "test@example.com"
        const deleteResult = await User.deleteOne({ email: targetEmail })
        expect(deleteResult.deletedCount).to.equal(1)

        const findResult = await User.findOne({ email: targetEmail })
        expect(findResult).to.be.null

    })

})