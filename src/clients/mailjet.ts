import Mailjet from "node-mailjet";
import { LogType, logger } from "../utils/logger.js";

const MODULE = "clients :: mailjet"

export function createMailjetClient() {
    const apiKey = process.env.MAILJET_API_KEY
    const apiSecret = process.env.MAILJET_SECRET_KEY
    logger(MODULE, "Mailjet client initialized", LogType.SUCCESS)
    return Mailjet.apiConnect(apiKey!, apiSecret!)    
}