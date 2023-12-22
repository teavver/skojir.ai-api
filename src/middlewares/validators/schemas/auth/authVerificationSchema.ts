import Joi from "joi";
import { verificationSchema } from "../verificationSchema.js";
import { authUserSchema } from "./authUserSchema.js";

export const authVerificationSchema = Joi.object({
    userVerification: verificationSchema,
    user: authUserSchema
})