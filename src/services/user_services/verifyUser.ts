import { User } from "../../models/User.js"
import { logger, LogType } from "../../utils/logger.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { IUserVerification } from "../../types/interfaces/IUserVerification.js"
import { IUserUnverified } from "../../types/interfaces/IUserUnverified.js"
import { verificationSchema } from "../../middlewares/validators/schemas/verificationSchema.js"
import { generateOTP } from "../../utils/crypto/genOTP.js"
import { validateRequest } from "../../utils/validateRequest.js"
import { sendEmail } from "../../utils/sendEmail.js"
import { generateExpiryDate } from "../../utils/genExpiryDate.js"
import { Request } from "express"

const MODULE = "services :: user_services :: verifyUser"

export async function verifyUser(req: Request<IUserVerification>): Promise<ServiceResponse<IUserVerification>> {
    const verificationData: IUserVerification = {
        email: req.body.email,
        otp: req.body.otp,
        resend: req.body.resend,
    }

    const vRes = await validateRequest<IUserVerification>(MODULE, verificationData, verificationSchema)
    if (!vRes.isValid) {
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: vRes.statusCode,
        }
    }

    const user = (await User.findOne({
        email: vRes.data.email,
    })) as IUserUnverified
    if (!user) {
        return {
            err: true,
            errMsg: `User does not exist.`,
            statusCode: 404,
        }
    }

    if (user.isEmailVerified) {
        return {
            err: true,
            errMsg: `Account is already verified.`,
            statusCode: 409,
        }
    }

    // re-send case
    if (verificationData.resend) {
        const newCode = generateOTP()
        const newExpDate = generateExpiryDate()

        try {
            await User.updateOne(
                { email: user.email },
                {
                    $set: {
                        emailOTP: newCode,
                        emailOTPExpires: newExpDate,
                    },
                },
            )

            const emailRes = await sendEmail(
                user.email,
                `Account verification code: ${newCode}`,
                `Use this code to verify your skojir account. \n${newCode}`,
            )

            if (emailRes.err) {
                return {
                    err: true,
                    errMsg: emailRes.errMsg,
                    statusCode: emailRes.statusCode,
                }
            }

            logger(MODULE, `Re-sending verification code for: ${user.email}`)
            return {
                err: false,
                data: verificationData,
                statusCode: 200,
            }
        } catch (err) {
            const errMsg = (err as Error).message
            logger(MODULE, `Resend verification code case failed. Err: ${errMsg}`, LogType.WARN)
            return {
                err: true,
                errMsg: errMsg,
                statusCode: 500,
            }
        }
    }

    if (user.emailOTP !== verificationData.otp) {
        return {
            err: true,
            errMsg: "Invalid verification code.",
            statusCode: 400,
        }
    }

    if (new Date() >= user.emailOTPExpires) {
        return {
            err: true,
            errMsg: "Verification code expired.",
            statusCode: 400,
        }
    }

    try {
        await User.updateOne(
            { email: user.email },
            {
                $set: {
                    isEmailVerified: true,
                },
                $unset: {
                    emailOTP: "",
                    emailOTPExpires: "",
                },
            },
        )
    } catch (err) {
        const dbErr = (err as Error).message
        logger(MODULE, dbErr, LogType.WARN)
        return {
            err: true,
            errMsg: `Internal database error.`,
            statusCode: 500,
        }
    }

    return {
        err: false,
        data: verificationData,
        statusCode: 200,
    }
}
