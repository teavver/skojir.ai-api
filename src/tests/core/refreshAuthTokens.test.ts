import axios from "axios"
import sinon from "sinon"
import { expect } from "chai"
import { testUser, setupTests, teardownTests, refreshTokensURL } from "../_setup.js"
import { accountSetup, testAxiosRequest } from "../_utils.js"
import { UserAuthTokens } from "../../types/AuthToken.js"

const MODULE = "refreshAuthTokens"

describe.only("[CORE] Refresh auth tokens", function () {

    this.timeout(5000)

    let tokens: UserAuthTokens = { accessToken: "", refreshToken: "", membershipToken: "" }
    let clock

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup (create and verify account)", async () => {
        const tokenData = await accountSetup(MODULE, testUser)
        expect(tokenData).to.not.be.null
        if (tokenData) { tokens = tokenData }
    })

    it("Should refresh tokens (valid request)", async () => {

        const config = {
            headers: {
                Cookie: `refreshToken=${tokens.refreshToken}`
            }
        }

        const req = () => axios.post(refreshTokensURL, null, config)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(200)

        const newAccessToken = res?.data.tokens.accessToken
        expect(newAccessToken).to.not.be.null
        
        const cookies = res?.headers['set-cookie']
        expect(cookies).to.be.an('array')
        
        const newRefreshToken = cookies?.find(cookie => cookie.startsWith('refreshToken='))?.split('=')[1].split(';')[0]
        expect(newRefreshToken).to.not.be.null

    })

    it("Should reject request with invalid token", async () => {

        const config = {
            headers: {
                Cookie: `refreshToken=${tokens.accessToken}` // wrong token
            }
        }

        const req = () => axios.post(refreshTokensURL, null, config)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(401)

    })

    it("Should refresh and generate new authTokens", async () => {

        // Skip 1 hour time
        const startTime = new Date()
        clock = sinon.useFakeTimers(startTime.getTime())
        const oneHourInMs = 1000 * 60 * 60
        clock.tick(oneHourInMs)

        const config = {
            headers: {
                Cookie: `refreshToken=${tokens.refreshToken}`
            }
        }

        const req = () => axios.post(refreshTokensURL, null, config)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(200)
        
        const newAccessToken = res?.data.tokens.accessToken
        const cookies = res?.headers['set-cookie']
        const newRefreshToken = cookies?.find(cookie => cookie.startsWith('refreshToken='))?.split('=')[1].split(';')[0]

        expect(newAccessToken).to.not.equal(tokens.accessToken)
        expect(newRefreshToken).to.not.equal(tokens.refreshToken)

        clock.restore()

    })


})