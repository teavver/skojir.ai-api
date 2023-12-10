import Joi from "joi";
import { emailSchema } from "./emailSchema.js";
import IUserVerification from "../../../types/interfaces/IUserVerification.js";

export const verificationSchema = Joi.object<IUserVerification>({
    email: emailSchema,
    verificationCode: Joi.string()
        .pattern(/^[0-9]{6}$/) // 6 digit code
        .required(),
    resend: Joi.bool() // optional
})