import { logger, LogType } from "../../utils/logger.js";
import { mailjetClient } from "../../main.js";
import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
import { MailjetRequest } from "../../types/requests/MailjetRequest.js";

const MODULE = "services :: user_services :: sendVerificationCodeEmail"

/**
 * Send e-mail with verification code to a user
 */
export async function sendVerificationCodeEmail(userEmail: string, code: string, message: string = "Use this code to verify your account"): Promise<ServiceResponse> {

    const reqData: MailjetRequest = {
        from: "skojirai@gmail.com",
        name: "skojir.ai",
        subject: `Code: ${code}`,
        textPart: message,
        HTMLPart: `<h1>${code}<h1>`,
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
        
        logger(MODULE, `Verification e-mail sent to: ${userEmail}`)
        return {
            err: false,
            data: request.body as string,
            statusCode: 200
        }
    } catch (err) {
        const errMsg = (err as Error).message
        logger(MODULE, `Failed to send verification e-mail to: ${userEmail}. Err: ${errMsg}`, LogType.WARN)
        return {
            err: true,
            errMsg: errMsg,
            statusCode: 500
        }
    }
}