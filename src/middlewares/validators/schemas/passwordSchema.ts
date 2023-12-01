import Joi from "joi";
import IUserCredentials from "../../../types/interfaces/IUserCredentials";

export const passwordSchema = Joi.string<IUserCredentials["password"]>()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$"))
    // 8-64 characters, min 1 lowercase letter, min 1 uppercase letter, min 1 digit, min 1 special character from set {@,$,!,%,*,?,&}
    .required()