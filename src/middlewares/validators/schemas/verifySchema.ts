import Joi, { number } from "joi";
import { emailSchema } from "./emailSchema.js";
import IUserVerification from "../../../types/interfaces/IUserVerification.js";

/**
 * Schema for account verification request
 */
export const verifyUserSchema = Joi.object<IUserVerification>({
    email: emailSchema,
    verificationCode: Joi.string()
        .pattern(/^[0-9]{6}$/) // 6 digit code
        .required(),
    resend: Joi.bool() // optional
})