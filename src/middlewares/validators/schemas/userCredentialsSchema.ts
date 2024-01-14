import Joi from "joi";
import { emailSchema } from "./emailSchema.js";
import { passwordSchema } from "./passwordSchema.js";
import { deviceIdSchema } from "./deviceIdSchema.js";
import { IUserCredentials, IUserCredentialsExt } from "../../../types/interfaces/IUserCredentials.js";

export const userCredentialsSchema = Joi.object<IUserCredentials>({
    email: emailSchema,
    password: passwordSchema
})

export const userCredentialsExtSchema = Joi.object<IUserCredentialsExt>({
    email: emailSchema,
    password: passwordSchema,
    deviceId: deviceIdSchema
})