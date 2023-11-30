import Joi from 'joi';

export const emailSchema = Joi.string()
    .email({ tlds: { allow: true } })
    .min(6)
    .max(254)
    .required()