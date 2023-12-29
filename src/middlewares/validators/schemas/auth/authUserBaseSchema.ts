import Joi from "joi";
import { emailSchema } from "../emailSchema.js";
import { IUserVerified } from "../../../../types/interfaces/IUserVerified.js";
import { authUserSchema } from "./authUserSchema.js";
import IUserBase from "../../../../types/interfaces/IUserBase.js";

export interface AuthUserBaseSchemaResult extends IUserBase {
    user: IUserVerified
}

export const authUserBaseSchema = Joi.object<AuthUserBaseSchemaResult>({
    email: emailSchema,
    user: authUserSchema
})