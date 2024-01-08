import Joi from "joi";
import { IUserBase } from "../../../types/express/interfaces/IUserBase.js";

export const emailSchema = Joi.string<IUserBase>()
    .email({ tlds: { allow: true } })
    .min(6)
    .max(254)
    .required()