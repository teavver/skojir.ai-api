import { openAIClient } from "../main.js"
import { logger, LogType } from "../utils/logger.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import { SolveRequest, SolverOutputFormat } from "../types/requests/SolveRequest.js"
import { GPTSettings } from "../types/GPTSettings.js"
import { validOutputFormats } from "../types/requests/SolveRequest.js"

const MODULE = "services :: sendVisionPrompt"

const systemInstructions = (formatting: string) => `
    You are an AI specialized in assisting with homework assignments.
    Your task includes analyzing images (screenshots) and solve the problems presented.
    Apply advanced image recognition and analytical skills to accurately decipher the questions.
    If the solution isn't clear, you're allowed to make an educated guess.
    Your Responses should strictly follow user's formatting preferences.
    Response format instructions will start and end with three asterisk characters.
    ${formatting}.`

const gptSettings: GPTSettings = {

    minimal: {
        system: systemInstructions(`*** Desired output format example: "(Question Number) - Answer/-s" Keep the answers very short and concise ***`),
        max_tokens: 100
    },

    standard: {
        system: systemInstructions(`*** Desired output format example: "(Question Nr) - Answer/s" Upper word limit: 300. Provide a short explanation for each answer (one to two sentences) ***`),
        max_tokens: 300
    }
}

/**
 * Puts together and sends a full request (system, image, header, footer) to gpt-4-1106-vision-preview
 */
export async function sendVisionPrompt(req: SolveRequest): Promise<ServiceResponse<string>> {

    // check output format
    const validOutputFormat = validOutputFormats.includes(req.outputFormat)
    if (!validOutputFormat) {
        const err = `Output of type ${req.outputFormat} is not supported.`
        logger(MODULE, err)
        return {
            err: true,
            errMsg: err,
            statusCode: 400
        }
    }

    const { system, max_tokens } = gptSettings[req.outputFormat as SolverOutputFormat]
    logger(MODULE, "Sending the request to openAI...")

    try {
        const response = await openAIClient.chat.completions.create({
        messages: [
            {
                role: "system",
                content: system,
            },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: {
                            url: req.img,
                            detail: "high",
                        },
                    },
                ],
            },
        ],
        model: "gpt-4-vision-preview",
        max_tokens: max_tokens,
        temperature: 0.25 // FIXME : Find good value
        })

        const res = response.choices[0].message.content

        if (!res) {
            const err = "Failed to get a response from ChatGPT"
            logger(MODULE, err, LogType.ERR)
            return {
                err: true,
                errMsg: err,
                statusCode: 500
            }
        }

        logger(MODULE, "Request handled successfully.")
        return {
            err: false,
            data: res,
            statusCode: 200
        }
            
    } catch (err) {
        console.log(err)
        logger(MODULE, `Request err: ${err}`, LogType.ERR)
        return {
            err: true,
            errMsg: "Internal error",
            statusCode: 500
        }
    }
}