import Joi from "joi";
import { IUserVerified } from "../../../../types/interfaces/IUserVerified.js";

export const authUserSchema = Joi.object<IUserVerified>().optional()