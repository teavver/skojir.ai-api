import Joi from "joi"
import { emailSchema } from "./emailSchema.js"
import { IUserVerification } from "../../../types/interfaces/IUserVerification"

/**
 * Schema for:
 * - Verifying the email of unverified account
 * - Changing the email of existing verified account
 */
export const verificationSchema = Joi.object<IUserVerification>({
    email: emailSchema,
    otp: Joi.string()
        .pattern(/^[0-9]{6}$/) // 6 digit code
        .required(),
    resend: Joi.bool().optional(),
})
