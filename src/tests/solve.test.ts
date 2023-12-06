import { testUser, setupTests, teardownTests, gcfStatusURL, gcfSolveURL, registerURL, verifyURL, loginURL } from "./_setup.js"
import axios, { AxiosRequestConfig } from "axios"
import { expect } from "chai"
import { testAxiosRequest } from "./_utils.js"
import { UserAuthTokens } from "../types/AuthToken.js"
import { fullUserSetup } from "./_utils.js"

const MODULE = "solve"

describe("Test backend service", function () {

    this.timeout(15000)

    let tokens: UserAuthTokens
    const imgData = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAclBMVEXgmV7///93s9RPXXO6gVL1z4fin2j78uvvzK7os4b9+fXkpnL57OHx0rjmrHz35dfuxqX138ztzYxSYnnz2cJyqMhXbYXquZGHt8rGxaRtnrxefZdmjarsv5qPuMZZc4vUsJPDkWjEh1XSkFprmLZjiKThcfcuAAAEk0lEQVR4nM2b62KjIBCFcTXeEmMuTdok7eba93/FVSPKcB0VZM/PJmW+wAFxGEgwQkmZbrIsJp3iLNukZTKmLTL0H8qUjQwVZ2npFCApMlXsXlkxqCfwAEmxNkd/az2AAQuw/cRGf+tzaxMgL5bDwtdaFrklgDxVuk6vOEUgGAFGh0cimAC2Izqf1dLkBT1Agph2JmX6GaEFSKeHr5WOBEjQ896ktaYT1AAfE8zHK/4YDrCxF77WZiBAbq37qdaKCSkHWE2cfDItV3iAlcXh7xVLCWQAbuIrCCQAH27C15JMBhFg5S4+IWIfCACu+v8tcRR4ALfxJQQcQO5g/kEtcy2A9fVH1FoHwK2/P4M32TKVP7BVuCoDADgBFUvXCHELK5iMLEACDMgP1hRBa8Xs05kFgAaw9vtrwcWFtQEDAPc/PzbjBwH0AbNH6gESaBUr/utVwtb7QegBuP2n3fhVIKBMBNjCb8RuAUi3W6cA/BLYAfyZKAVAN8cogLADdwzQ+bANlAvPINcAcQ4AxFcQ1wC0C4iiA9wDtF3wDlQIH7sHIAUDINkFuAdY9gBb8dMZAN5rQRNIlv+ZAeCTAiSSD+cAaJ4IRG7BcQBfp91isTt9YQGKFkC6ERwB8LcKX2v3FwmwfgNIR2AEwFcbvyJg+kAHUI8BUYzACIDTotMJCVA0APJE1HCAXQ+wQwJkDYD0oxEAC0ZIgDo6v1maF6CsABS5uFmGoHokEoUF5jFhZQISKF6HZ5mG1c6PyFeBeRaiSglReHCWpbhSSVT54DEAMhkAUqLKiM4EsCGqhPxMAJl/AFVSSgdw+D2GYXi8nKcDqHNiGoDfkOp6mAqglhLgcAx77V/zA+xDIBOBdYAjjB/uDUawDXAJeR1nBfgW4ldOnBHgLIkfht+zARz2UoBQZwOrALwBOyNqlgObAKIBEUY0AuCXYpkBqS5jAWL8w0huQCqwHl0qr1zPKAD801BlQNGI5/abvzgA7IZEZUDBBueO9BsBsMFuydQGpLry8d+9YgBIkZtSnQGpmi5/sSO1NwOUuG253oBUlRFfQq8YABLUi4nJgPQHn1/8n77NLyaYVzOTAanE7+0PeoAM9XJqNqBaVz1Aink9xxhQLT1AiUhQ4Aw4EgCRokEacBxAhkhSYQ04CqBApOkmxtcDJIhEpUuANlGpT9W6BKCpWm2y2iUATVZr0/UOAbp0vfbAwpYkIfoDC92RjTsA5shGd2jlDoA9tNIc2zkDAMd2moNLZwDg4FJzdOsKgDu6VR9euwLgDq/FCibHAMLxvbAWOAYQChj8l3D4L2LhfHizC3CTOhACwH1BZLeQKWLbVhQywVKu6G6zlOvOAihLuUAx2yO62ytmu0cPpmllMRso53tGUXSzU853q5p69i1ryvmADR6RRTEdoC1oBAuiTYC+VUNJJyhqtdYHzO83FbVCgqcVhMdTE/8/LGz2X9rtv7jdf3m//wsO/q94BN4vuQT+r/n4v+gUeL/qFfi/7BZ4v+4X+L/wOAXBzpXPBsHvpddGfq/9NvJ88bll8Hn1u5XXy+9UNq///wN9slxdAnIGBgAAAABJRU5ErkJggg=="

    before(async () => {
        await setupTests(MODULE)
    })

    after(async () => {
        await teardownTests(MODULE)
    })

    it("Setup a user (register, verify, login)", async () => {
        tokens = await fullUserSetup(MODULE, testUser)
    })

    it("Check status of backend service", async () => {
        const req = () => axios.get(gcfStatusURL)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.equal(200)
    })

    it("Try to use /solve without the Bearer token", async () => {
        const data = {
            email: testUser.email, threshold: 0.25, img: imgData
        }
        const req = () => axios.post(gcfSolveURL, data)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(401)
    })

    it("Use /solve with valid auth token", async () => {
        const data = {
            email: testUser.email, threshold: 0.25, img: imgData
        }
        const reqConf: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${tokens.accessToken}` }
        }
        const req = () => axios.post(gcfSolveURL, data, reqConf)
        const res = await testAxiosRequest(MODULE, req)
        expect(res?.status).to.be.equal(200)
    })


})