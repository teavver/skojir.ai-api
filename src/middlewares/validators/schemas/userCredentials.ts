import { emailSchema } from "./emailSchema";
import { passwordSchema } from "./passwordSchema";
import Joi from "joi";

/**
 * Schema for generic user credentials input (email + password)
 */
export const userCredentialsSchema = Joi.object({
    emailSchema,
    passwordSchema
})