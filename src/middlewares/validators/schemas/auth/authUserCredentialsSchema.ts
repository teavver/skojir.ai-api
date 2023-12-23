import Joi from "joi";
import { userCredentialsSchema } from "../userCredentialsSchema.js";
import { authUserSchema } from "./authUserSchema.js";
import IUserCredentials from "../../../../types/interfaces/IUserCredentials.js";
import { IUserVerified } from "../../../../types/interfaces/IUserVerified.js";

export interface AuthUserCredentialsSchemaResult extends IUserCredentials {
    user: IUserVerified
}

export const authUserCredentialsSchema = userCredentialsSchema.append({
    user: authUserSchema
}) as Joi.ObjectSchema<AuthUserCredentialsSchemaResult>