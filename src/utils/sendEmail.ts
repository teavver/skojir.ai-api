import { logger, LogType } from "./logger.js";
import { mailjetClient } from "../main.js";
import { ServiceResponse } from "../types/responses/ServiceResponse.js";
import { MailjetRequest } from "../types/requests/MailjetRequest.js";

const MODULE = "utils :: sendEmail"

export async function sendEmail(userEmail: string, subject: string, text: string): Promise<ServiceResponse<string>> {

    const reqData: MailjetRequest = {
        from: "skojirai@gmail.com",
        name: "skojir.ai",
        subject: subject,
        textPart: text,
        HTMLPart: ``,
    }

    try {
        const request = await mailjetClient
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages":[{
                    "From": {
                        "Email": reqData.from,
                        "Name": reqData.name
                    },
                    "To": [{
                        "Email": userEmail
                    }],
                    "Subject": reqData.subject,
                    "TextPart": reqData.textPart,
                    "HTMLPart": reqData.HTMLPart
                }]
            })
        
        logger(MODULE, `Email (subject: ${subject}) sent to: ${userEmail}`)
        return {
            err: false,
            data: request.body as string,
            statusCode: 200
        }
    } catch (err) {
        const errMsg = (err as Error).message
        logger(MODULE, `Failed to send an Email to: ${userEmail}. Err: ${errMsg}`, LogType.WARN)
        return {
            err: true,
            errMsg: errMsg,
            statusCode: 500
        }
    }
}