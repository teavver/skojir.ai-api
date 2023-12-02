import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import solverRoute from "../routes/solver.js";
import statusRoute from "../routes/status.js";
import rootRoute from "../routes/root.js";
import registerRoute from "../routes/user_routes/register.js";
import deleteRoute from "../routes/user_routes/delete.js"
import verifyRoute from "../routes/auth/verify.js";
import loginRoute from "../routes/auth/login.js"
import { logger } from "./logger.js";

const MODULE = "utils :: setupRoutes"

export function setupRoutes(app: Express) {

    const authRoutesLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5, // 5 per hour
        message: "Too many requests."
    })

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

    // auth
    const authRouter = express.Router()
    authRouter.use("/login", authRoutesLimiter, loginRoute)
    authRouter.use("/verify", authRoutesLimiter, verifyRoute)
    app.use("/auth", authRouter)

    // user routes
    app.use("/register", userRoutesLimiter, registerRoute)
    app.use("/solve", solveRouteLimiter, solverRoute)
    app.use("/delete", userRoutesLimiter, deleteRoute)

    // general
    app.use("/", rootRoute)
    app.use("/status", statusRoute)

    logger(MODULE, `Routes set up`)
} 