import Joi from "joi";
import { emailSchema } from "./emailSchema.js";
import { passwordSchema } from "./passwordSchema.js";
import { IUserCredentials } from "../../../types/interfaces/IUserCredentials.js";

export const userCredentialsSchema = Joi.object<IUserCredentials>({
    email: emailSchema,
    password: passwordSchema
})