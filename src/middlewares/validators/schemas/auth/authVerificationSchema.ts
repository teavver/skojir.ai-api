import Joi from "joi";
import { verificationSchema } from "../verificationSchema.js";
import { authUserSchema } from "./authUserSchema.js";
import IUserVerification from "../../../../types/interfaces/IUserVerification.js";
import { IUserVerified } from "../../../../types/interfaces/IUserVerified.js";

export interface AuthEmailChangeRequestResult extends IUserVerification {
    user: IUserVerified
}

export const authEmailChangeSchema = verificationSchema.append({
    user: authUserSchema
}) as Joi.ObjectSchema<AuthEmailChangeRequestResult>
