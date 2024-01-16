import { SUPPORTED_TOKENS } from "../../../../types/AuthToken"
import Joi from "joi"

export const authTokenSchema = Joi.string().valid(SUPPORTED_TOKENS)
