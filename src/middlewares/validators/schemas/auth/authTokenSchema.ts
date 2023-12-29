import { AuthTokenType } from "../../../../types/AuthToken";
import Joi from "joi";

export const authTokenSchema = Joi.string().valid("accessToken", "refreshToken" as AuthTokenType)