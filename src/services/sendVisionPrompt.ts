import { openAIClient } from "../main.js"
import { logger, LogType } from "../utils/logger.js"
import { ServiceResponse } from "../types/responses/ServiceResponse.js"
import { SolveRequest, SolverOutputFormat } from "../types/requests/client/SolveRequest.js"
import { GPTSettings } from "../types/GPTSettings.js"
import { validOutputFormats } from "../types/requests/client/SolveRequest.js"

const MODULE = "services :: sendVisionPrompt"

/**
 * GPT Settings / Default prompt stuff
 */

const defaultSystemInstructions = `
    You are an AI assistant specialized in assisting with homework assignments.
    Your task includes analyzing provided images to interpret and solve the problems presented.
    Apply advanced image recognition and analytical skills to accurately decipher the questions.
    If the solution isn't clear, make an educated guess.
    Your Responses should strictly follow the format specified by the user.`

const gptSettings: GPTSettings = {

    minimal: {
        system: defaultSystemInstructions,
        header: "",
        footer: "Expected output eg: {Question Nr} - {Answer/s}. Keep the answers as short as possible, but don't skip any.",
        max_tokens: 100
    },

    standard: {
        system: defaultSystemInstructions,
        header: "",
        footer: "Expected output: {Question Nr} - {Answer/s}. Upper word limit: 300. Try to provide a short, concise explanation for each answer (one to two sentences)",
        max_tokens: 300
    }
}

/**
 * Puts together and sends a full request (system, image, header, footer) to gpt-4-1106-vision-preview
 */
export async function sendVisionPrompt(req: SolveRequest): Promise<ServiceResponse> {

    // check output format
    const validOutputFormat = validOutputFormats.includes(req.outputFormat)
    if (!validOutputFormat) {
        const err = `Output of type ${req.outputFormat} is not supported.`
        logger(MODULE, err)
        return {
            err: true,
            errMsg: err,
        }
    }

    const { system, header, footer, max_tokens } = gptSettings[req.outputFormat as SolverOutputFormat]
    logger(MODULE, "Sending the request to openAI...")

    try {
        
        const response = await openAIClient.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
        {
            role: "system",
            content: system,
        },
        {
            role: "user",
            content: [
                // header
                { type: "text", text: header },

                // img
                {
                    type: "image_url",
                    image_url: {
                        url: req.img,
                        detail: "high",
                    },
                },

                // footer
                { type: "text", text: footer },
            ],
        },
        ],
            max_tokens: max_tokens,
            temperature: 0.25 // FIXME : Find good value
        })

        const res = response.choices[0].message.content

        if (!res) {
            const err = "Failed to get response from ChatGPT"
            logger(MODULE, err, LogType.ERR)
            return {
                err: true,
                errMsg: err,
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
        }
    }
}