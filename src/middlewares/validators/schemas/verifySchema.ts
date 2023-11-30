import Joi from "joi";
import { emailSchema } from "./emailSchema";

/**
 * Schema for account verification request
 */
export const verifyUserSchema = Joi.object({
    emailSchema,
    code: Joi.string()
        .length(6)
        .required()
})