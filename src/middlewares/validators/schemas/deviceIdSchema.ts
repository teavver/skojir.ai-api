import Joi from "joi"
import { IDeviceID } from "../../../types/interfaces/IDeviceID"

export const deviceIdSchema = Joi.string<IDeviceID>()
    .pattern(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    .required()
