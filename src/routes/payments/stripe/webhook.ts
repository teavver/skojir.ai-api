import express, { Request, Response } from "express"
import Stripe from "stripe"
import { stripeClient } from "../../../main.js"
import { ResponseMessage } from "../../../types/responses/ResponseMessage"
import { responseCodes } from "../../../utils/responseCodes.js"
import { LogType, logger } from "../../../utils/logger.js"

const MODULE = "routes :: payments :: stripeWebhook"

const handleStripeWebhook = async (req: Request, res: Response<ResponseMessage>) => {
    const sig = req.headers["stripe-signature"]
    let event: Stripe.Event

    let statusCode: number = 400
    let resData: ResponseMessage = {
        state: "error",
        message: "Init",
    }

    if (!sig) {
        logger(MODULE, `Received no signature in webhook headers, rejecting.`, LogType.WARN)
        return res.status(responseCodes.BAD_REQUEST).json({
            state: "error",
            message: "Missing signature in request headers.",
        })
    }

    try {
        event = stripeClient.webhooks.constructEvent(req.body, sig, "your_webhook_secret")
    } catch (error) {
        const err = error as Error
        logger(MODULE, `Webhook signature verification fail. Err: ${err.message}`, LogType.WARN)
        return res.status(responseCodes.BAD_REQUEST).json({
            state: "error",
            message: "Couldn't verify signature",
        })
    }

    // handle the incoming evt
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object
            logger(MODULE, `PaymentIntent was successful! ${paymentIntent}`, LogType.SUCCESS)
            resData = handlePaymentIntentSucceeded(paymentIntent)
            statusCode = responseCodes.SUCCESS
            break
        case "payment_intent.payment_failed":
            const paymentFailedIntent = event.data.object
            console.log("PaymentIntent failed:", paymentFailedIntent)
            resData = handlePaymentIntentFailed(paymentFailedIntent)
            statusCode = responseCodes.INTERNAL_SERVER_ERROR // Tmp
            break
        default:
            logger(MODULE, `Unhandled event type ${event.type}`, LogType.WARN)
            break
    }
    res.status(statusCode).json(resData)
}

const handlePaymentIntentSucceeded = (paymentIntent: Stripe.PaymentIntent): ResponseMessage => {
    console.log(`PaymentIntent for ${paymentIntent.amount} was successful.`)
    // TODO: Update Membership for User here (payment successful)
    return {
        state: "success",
        message: "Payment successful",
    }
}

const handlePaymentIntentFailed = (paymentIntent: Stripe.PaymentIntent): ResponseMessage => {
    console.log(`PaymentIntent for ${paymentIntent.amount} failed.`)
    // You could update order status in your database, notify user, etc.
    return {
        state: "error",
        message: "Payment failed.",
    }
}

const router = express.Router()
router.post("/", handleStripeWebhook)
export default router
