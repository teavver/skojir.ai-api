import { openAIClient } from "../main.js"
import { logger, LogType } from "../utils/logger.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import { SolveRequest, SolverOutputFormat } from "../types/requests/SolveRequest.js"
import { GPTSettings } from "../types/GPTSettings.js"
import { validOutputFormats } from "../types/requests/SolveRequest.js"

const MODULE = "services :: sendVisionPrompt"

const systemInstructions = (formattingInstr: string) => `
    You are an AI specialized in assisting with educational assignments.
    Your task includes analyzing attached images and solving the problems presented.
    The assignment's question language may vary, but you always answer in English.
    If the solution isn't clear, you're allowed to make an educated guess.
    Your responses should be as short as possible, respecting User's upper word limits.
    You are allowed to use MathJax syntax in your responses when needed.
    It is your responsibility to fit the solution in the specified word limit (including any MathJax content).
    ${formattingInstr}.`

const gptSettings: GPTSettings = {
    minimal: {
        system: systemInstructions(
            `Keep the answers very short and concise. Upper word limit: 40`,
        ),
        max_tokens: 120,
    },

    standard: {
        system: systemInstructions(
            `Provide a very short explanation with your answer (one to two sentences). Upper word limit: 100`
        ),
        max_tokens: 900,
    },
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
            statusCode: 400,
        }
    }

    const { system, max_tokens } = gptSettings[req.outputFormat as SolverOutputFormat]

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
            temperature: 0.25, // FIXME : Find good value
        })

        const res = response.choices[0].message.content
        logger(MODULE, JSON.stringify(res, null, 4)) // DEBUG

        if (!res) {
            const err = "Failed to get a response from OpenAI"
            logger(MODULE, err, LogType.ERR)
            return {
                err: true,
                errMsg: err,
                statusCode: 500,
            }
        }

        logger(MODULE, "Request handled successfully.")
        return {
            err: false,
            data: res,
            statusCode: 200,
        }
    } catch (err) {
        logger(MODULE, `Request err: ${err}`, LogType.ERR)
        return {
            err: true,
            errMsg: "Internal error",
            statusCode: 500,
        }
    }
}
