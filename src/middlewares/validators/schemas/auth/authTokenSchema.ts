import Joi from "joi";

export const authTokenSchema = Joi.string().valid("accessToken", "refreshToken")