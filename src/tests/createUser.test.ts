import mongoose from "mongoose"
import { User } from "../models/User.js"
import { expect } from "chai"
import { logger, LogType } from "../utils/logger.js"

const MODULE = "tests :: createUser"

describe('create a dummy User', () => {

  before(async () => {
    const dbURL = process.env.DB_URL
    if (!dbURL) {
        logger(MODULE, "Couldn't find dbURL in .env")
        return
    }
    await mongoose.connect(dbURL)
  })

  after(async () => {
    await mongoose.disconnect()
  })

  it('should create a new user', async () => {
    const user = new User({ email: 'test@example.com', password: 'password123', verificationCode: '123456' })
    const savedUser = await user.save()

    expect(savedUser).to.have.property('email', 'test@example.com')
    expect(savedUser).to.have.property('password')
    expect(savedUser).to.have.property('verificationCode', '123456')
    expect(savedUser).to.have.property('isEmailVerified', false)
  })

})