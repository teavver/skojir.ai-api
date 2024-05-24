import express, { Request, Response } from "express";
import { stripeClient } from "../../../main.js";
import { logger } from "../../../utils/logger.js";
import { responseCodes } from "../../../utils/responseCodes.js";
import { StripeResponseMessage } from "../../../types/responses/ResponseMessage";

const MODULE = "routes :: payments :: stripePaymentIntent"
// TODO: Probably make a controller and service to keep it tidy

const handleCreatePaymentIntent = async (req: Request, res: Response<StripeResponseMessage>) => {
    try {
        const { amount, currency } = req.body
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount,
            currency,
        })

        res.status(responseCodes.SUCCESS).json({
            state: "success",
            message: "OK",
            clientSecret: paymentIntent.client_secret as string,
        })
    } catch (error) {
        const err = (error as Error)
        logger(MODULE, `Error while creating payment intent: '${err.message}'`)
        res.status(responseCodes.INTERNAL_SERVER_ERROR).json({
            state: "error",
            message: err.message,
        })
    }
}

const router = express.Router()
router.get("/", handleCreatePaymentIntent)
export default router