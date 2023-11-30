import Joi from "joi";

export const passwordSchema = Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$"))
    // 8-64 characters, min 1 lowercase letter, min 1 uppercase letter, min 1 digit, min 1 special character from set {@,$,!,%,*,?,&}
    .required()