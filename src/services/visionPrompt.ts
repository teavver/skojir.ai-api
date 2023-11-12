import { openAIClient } from "../app.js"
import { VisionRequest } from "../types/requests/VisionRequest.js"
import { logger, LogType } from "../utils/logger.js"
import { validateVisionPromptRequest } from "../middlewares/validators/visionPrompt.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"

const MODULE = "services :: visionPrompt"

/**
 * Sends a full request (image + header, footer) to gpt-4-1106-vision-preview
 */
export async function requestVisionPrompt(req: VisionRequest): Promise<ServiceResponse> {

    const [valid, reqData] = await validateVisionPromptRequest(req) as [boolean, VisionRequest]

    if (!valid){
        const err = "Failed to validate vision prompt req"
        logger(MODULE, err, LogType.ERR)
        return {
            err: true,
            errMsg: err,
            data: ""
        }
    }

    const { header, img, footer, max_tokens } = reqData
    // logger(MODULE, `req: header: ${header} , footer: ${footer} maxTokens: ${max_tokens}`)
    logger(MODULE, "Sending vision prompt to openAI...")

    try {
        
        const response = await openAIClient.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
        {
            role: "user",
            content: [
                { type: "text", text: header },
                {
                    type: "image_url",
                    image_url: {
                        url: img,
                        detail: "high",
                    },
                },
                { type: "text", text: footer }, // loc matters?
            ],
        },
        ],
            max_tokens: max_tokens
        })

        const res = response.choices[0].message.content

        if (!res) {
            const err = "Failed to get response from ChatGPT"
            logger(MODULE, err, LogType.ERR)
            return {
                err: true,
                errMsg: err,
                data: ""
            }
        }

        logger(MODULE, "Request handled successfully.")
        return {
            err: false,
            data: res,
        }
        
    } catch (err) {

        logger(MODULE, `Request err: ${err}`, LogType.ERR)
        return {
            err: true,
            errMsg: (err as Error).message,
            data: ""
        }

    }
}