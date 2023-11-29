import { rateLimit } from "express-rate-limit"
import solverRoute from "../routes/solver.js"
import statusRoute from "../routes/status.js"
import rootRoute from "../routes/root.js"
import registerRoute from "../routes/user_routes/register.js"
import verifyRoute from "../routes/user_routes/verify.js"
import { logger, LogType } from "./logger.js"
import { Express } from "express"

const MODULE = "utils :: setupRoutes"

export function setupRoutes(app: Express) {

    const userRoutesLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 20, // 20 per windowMs
        message: "Too many requests."
    })

    const solveRouteLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 min
        max: 50, // 50 per windowMs
        message: "Too many requests."
    })

    app.use("/register", userRoutesLimiter, registerRoute)
    app.use("/verify", userRoutesLimiter, verifyRoute)
    app.use("/solve", solveRouteLimiter, solverRoute)

    app.use("/", rootRoute)
    app.use("/status", statusRoute)

    logger(MODULE, `Routes set up`)
} 