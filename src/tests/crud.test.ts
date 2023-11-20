import { expect } from "chai"
import { describe, it } from "mocha"
import { User } from "../models/supabase/User.js"
import { logger, LogType } from "../utils/logger.js"
import { dbClient } from "../app.js"

const MODULE = "tests :: crud.test.ts"

const dummyEmail = 'testuser@example.com'
const dummyPwd = "securepassword"

describe('Create a dummy user', () => {
  it('should create a new user', async () => {
    const { data, error } = await dbClient
      .from('users')
      .insert([{ email: dummyEmail, password: dummyPwd, membership: false }])
    
    expect(error).to.be.null
    expect(data).to.have.lengthOf(1)
    expect(data![0]).to.have.property('id')
  })
})


describe('Read a dummy user', () => {
  it('should retrieve user details', async () => {
    const { data, error } = await dbClient
      .from('users')
      .select('*')
      .eq('email', dummyEmail)
    
    expect(error).to.be.null
    expect(data).to.have.lengthOf(1)
    expect(data![0].email).to.equal(dummyEmail)
  })
})

describe('Update dummy user', () => {
  it('should update user details', async () => {
    const { data, error } = await dbClient
      .from('users')
      .update({ membership: true })
      .eq('email', 'testuser@example.com')

    if (!data || error) {
        logger(MODULE, `Data is undefined or null. Err: ${error}`)
        return
    }
    
    const users = data as User[]
    
    expect(error).to.be.null
    expect(users).to.have.lengthOf(1)
    expect(users[0].membership).to.be.true
  })
})

describe('Delete dummy user', () => {
  it('should delete a user', async () => {
    const { data, error } = await dbClient
      .from('users')
      .delete()
      .match({ email: dummyEmail })

    expect(error).to.be.null
    expect(data).to.not.be.null
    expect(data).to.have.lengthOf(1)
  })
})