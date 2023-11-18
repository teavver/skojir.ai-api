// import Joi from "joi"
// import { VisionRequest } from "../../types/requests/VisionRequest.js"
// import { logger, LogType } from "../../utils/logger.js"

// const MODULE = "middlewares :: validators :: visionPrompt"

// export const validateVisionPromptRequest = async (req: VisionRequest): Promise<[boolean, Object]> => {
//     try {
//         const value = await visionPromptRequestSchema.validateAsync(req)
//         logger(MODULE, `Validated vision prompt req data`)
//         return [true, value]
//     } catch (err) {
//         logger(MODULE, `Could not validate vision prompt req data: ${err}`, LogType.ERR)
//         return [false, { error: err }]
//     }
// }

// const visionPromptRequestSchema = Joi.object({
//     header: Joi.string()
//         .min(20)
//         .max(100)
//         .required(),
//     img: Joi.string()
//         .min(20)
//         .max(2500000) // ~2.5MB string
//         .required(),
//     footer: Joi.string()
//         .min(20)
//         .max(100)
//         .required(),
//     max_tokens: Joi.number()
//         .min(25)
//         .max(300) // upper limit for medium length output
//         .required()
// })