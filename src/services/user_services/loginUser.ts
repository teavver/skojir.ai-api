import { User } from "../../models/User.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { deriveKey } from "../../utils/crypto/pbkdf2.js"
import { Request } from "express"
import { userCredentialsExtSchema } from "../../middlewares/validators/schemas/userCredentialsSchema.js"
import { validateRequest } from "../../utils/validateRequest.js"
import { logger, LogType } from "../../utils/logger.js"
import { IUserCredentialsExt } from "../../types/interfaces/IUserCredentials.js"
import { isUserVerified } from "../../utils/isUserVerified.js"
import { generateAuthToken } from "../../middlewares/auth/genToken.js"
import { isNewDeviceId } from "../../utils/isNewDeviceId.js"
import { IDeviceID } from "../../types/interfaces/IDeviceID.js"
import { UserAuthTokens } from "../../types/AuthToken.js"
import { UserRefreshToken } from "../../types/interfaces/IUserVerified.js"

const MODULE = "services :: user_services :: loginUser"

export async function loginUser(req: Request<IUserCredentialsExt>): Promise<ServiceResponse<UserAuthTokens>> {
    const userCredentialsExt: IUserCredentialsExt = {
        email: req.body.email,
        password: req.body.password,
        deviceId: req.body.deviceId,
    }

    const vRes = await validateRequest<IUserCredentialsExt>(MODULE, userCredentialsExt, userCredentialsExtSchema)
    if (!vRes.isValid) {
        logger(MODULE, `loginUser req rejected: Failed to validate input`, LogType.WARN)
        return {
            err: true,
            errMsg: `Incorrect password.`,
            statusCode: vRes.statusCode,
        }
    }

    const user = await User.findOne({ email: userCredentialsExt.email })
    if (!user) {
        logger(MODULE, `Failed to login user. Reason: No account matches user email`, LogType.WARN)
        return {
            err: true,
            errMsg: `Sorry, we couldn't find your account.
                Please double check your email address.
                If you haven't created an account yet, sign up using the "Create Account" button.
                `,
            statusCode: 404,
        }
    }

    const userVerified = isUserVerified(user)
    if (!userVerified) {
        logger(MODULE, `Failed to login user. Reason: Account not verified`, LogType.WARN)
        return {
            err: true,
            errMsg: `
                You need to verify your account first.
                Check your email inbox for the verification code or click here to create a new one.
                `,
            statusCode: 409,
        }
    }

    const saltedPwd = userCredentialsExt.password + user.salt
    const hashedPwd = deriveKey({ password: saltedPwd, salt: user.salt })

    if (hashedPwd !== user.password) {
        logger(MODULE, `loginUser req rejected: Invalid password`, LogType.WARN)
        return {
            err: true,
            errMsg: `
                Incorrect password.
                If you've forgotten your password, you can reset it using the "Forgot Password" button.
                `,
            statusCode: 400,
        }
    }

    const userAccessToken: UserAuthTokens["accessToken"] = generateAuthToken(user, "accessToken")
    const userRefreshToken: UserAuthTokens["refreshToken"] = generateAuthToken(user, "refreshToken")
    let userMembershipToken: UserAuthTokens["membershipToken"] = ""

    if (user.membershipDetails && user.membershipDetails.isActive === true) {
        userMembershipToken = generateAuthToken(user, "membershipToken")
    }

    const userTokens: UserAuthTokens = {
        refreshToken: userRefreshToken,
        accessToken: userAccessToken,
        membershipToken: userMembershipToken,
    }

    const reqDeviceId: IDeviceID = req.body.deviceId
    const isNewDevice = isNewDeviceId(user, reqDeviceId)

    if (isNewDevice) {
        const newToken: UserRefreshToken = {
            deviceId: reqDeviceId,
            token: userRefreshToken,
        }
        await User.updateOne({ email: user.email }, { $push: { refreshTokens: newToken } })
    } else {
        await User.updateOne(
            { email: user.email, "refreshTokens.deviceId": reqDeviceId },
            { $set: { "refreshTokens.$.token": userRefreshToken } },
        )
    }

    const deviceMsg = isNewDevice ? "(new device)" : "(existing device)"
    logger(MODULE, `User ${user.email} logged in. ${deviceMsg}`, LogType.SUCCESS)

    return {
        err: false,
        data: userTokens,
        statusCode: 200,
    }
}
