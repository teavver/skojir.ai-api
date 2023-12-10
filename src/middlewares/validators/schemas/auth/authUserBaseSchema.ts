import Joi from "joi";
import { emailSchema } from "../emailSchema.js";
import { authUserSchema } from "./authUserSchema.js";

export const authUserBaseSchema = Joi.object({
    email: emailSchema,
    user: authUserSchema
})