import Joi from "joi";
import { IUserPwdChange } from "../../../types/interfaces/IUserVerification";
import { passwordSchema } from "./passwordSchema.js";

export const pwdChangeSchema = Joi.object<IUserPwdChange>({
    otp: Joi.string()
        .pattern(/^[0-9]{6}$/) // 6 digit code
        .required(),
    newPwd: passwordSchema,
})