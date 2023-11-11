import { openAIClient } from "../app.js"
import { VisionRequest } from "../types/requests/VisionRequest.js"
import { logger, LogType } from "../utils/logger.js"
import { validateVisionPromptRequest } from "../middlewares/validators/visionPrompt.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"

const MODULE = "services :: openai :: prompter"

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
    logger(MODULE, "Sending request to GPT...")

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

        return {
            err: false,
            data: response.choices[0].message.content as string
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