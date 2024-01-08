import { User } from "../../models/User.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { logger, LogType } from "../../utils/logger.js";
import { validateRequest } from "../../utils/validateRequest.js";
import { IUserVerification } from "../../types/interfaces/IUserVerification.js";
import { Request } from "express";
import { verificationSchema } from "../../middlewares/validators/schemas/verificationSchema.js";

const MODULE = "services :: user_services :: emailChange"

export async function emailChange(req:Request<IUserVerification>): Promise<ServiceResponse<IUserVerification>> {

    const reqData: IUserVerification = {
        email: req.body.email,
        verificationCode: req.body.verificationCode,
    }

    const vRes = await validateRequest<IUserVerification>(MODULE, reqData, verificationSchema)
    if (!vRes.isValid) {
        console.log(vRes.error)
        logger(MODULE, `email change req rejected: Failed to validate input. Err: ${vRes.error}`, LogType.WARN)
        return {
            err: true,
            errMsg: vRes.error,
            statusCode: vRes.statusCode
        }
    }

    if (!req.user?.isEmailVerified) {
        logger(MODULE, `Failed to change email - user account is unverified`, LogType.WARN)
        return {
            err: true,
            errMsg: `Only verified accounts can perform this action.`,
            statusCode: 401
        }
    }

    // Check if user is trying to change their email to an already existing account
    const targetEmailUser = await User.findOne({ email: reqData.email })
    if (targetEmailUser) {
        const msg = `There's already an account with that email account.`
        logger(MODULE, msg, LogType.WARN)
        return {
            err: true,
            errMsg: msg,
            statusCode: 409
        }
    }
    
    if (!req.user.verificationCodeExpires || new Date() >= req.user.verificationCodeExpires) {
        return {
            err: true,
            errMsg: `Your email change OTP code expired.`,
            statusCode: 400
        }
    }
    
    if (reqData.verificationCode !== req.user.verificationCode) {
        return {
            err: true,
            errMsg: `Invalid OTP code.`,
            statusCode: 401
        }
    }
    
    try {
        
        // const prevEmail = user.email
        // TODO: Send email to old account & inform user about the change
        
        await User.updateOne({ email: reqData.email }, {
            $set: {
                email: reqData.email
            },
            $unset: {
                verificationCode: "",
                verificationCodeExpires: ""
            }
        })

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
        data: reqData,
        statusCode: 200
    }
}