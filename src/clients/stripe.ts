import Stripe from "stripe"
import { logger, LogType } from "../utils/logger.js"

const MODULE = "clients :: stripe"

export function createStripeClient(): Stripe {
    const key = process.env.STRIPE_SECRET_KEY
    const client = new Stripe(key, { apiVersion: "2024-04-10" })
    logger(MODULE, "Stripe client initialized", LogType.SUCCESS)
    return client
}
