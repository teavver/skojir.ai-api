import { LogType, logger } from "./logger.js"
import express, { Express } from "express"
import { conditionalMiddleware } from "./condMiddleware.js"
import { rateLimit } from "express-rate-limit"
import solverRoute from "../routes/solver.js"
import statusRoute from "../routes/status.js"
import rootRoute from "../routes/root.js"
import registerRoute from "../routes/user_routes/register.js"
import pwdChangeOTPRoute from "../routes/user_routes/pwdChangeOTP.js"
import emailChangeOTPRoute from "../routes/user_routes/emailChangeOTP.js"
import emailChangeRoute from "../routes/user_routes/emailChange.js"
import accountInfoRoute from "../routes/user_routes/accountInfo.js"
import deleteRoute from "../routes/user_routes/delete.js"
import refreshRoute from "../routes/auth/refreshTokens.js"
import verifyRoute from "../routes/auth/verify.js"
import loginRoute from "../routes/auth/login.js"
import updateRoute from "../routes/update.js"

const MODULE = "utils :: setupRoutes"

export function setupRoutes(app: Express) {
    const authRoutesLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5, // 5 / hour
        message: "Too many requests.",
    })

    const userRoutesLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 20, // 20 / hour
        message: "Too many requests.",
    })

    const solveRouteLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 min
        max: 15, // 60 / hour
        message: "Too many requests.",
    })

    // auth routes
    const authRouter = express.Router()
    authRouter.use("/login", conditionalMiddleware(authRoutesLimiter), loginRoute)
    authRouter.use("/verify", conditionalMiddleware(authRoutesLimiter), verifyRoute)
    authRouter.use("/refresh", conditionalMiddleware(authRoutesLimiter), refreshRoute)
    app.use("/auth", authRouter)

    // user routes
    app.use("/register", conditionalMiddleware(userRoutesLimiter), registerRoute)
    app.use("/delete", conditionalMiddleware(userRoutesLimiter), deleteRoute)
    app.use("/pwd-change-otp", conditionalMiddleware(userRoutesLimiter), pwdChangeOTPRoute)
    app.use("/email-change-otp", conditionalMiddleware(userRoutesLimiter), emailChangeOTPRoute)
    app.use("/email-change", conditionalMiddleware(userRoutesLimiter), emailChangeRoute)
    app.use("/account-info", conditionalMiddleware(userRoutesLimiter), accountInfoRoute)

    // secured routes
    app.use("/solve", conditionalMiddleware(solveRouteLimiter), solverRoute)

    // general
    app.use("/", rootRoute)
    app.use("/status", statusRoute)

    // github
    app.use("/update", updateRoute)

    logger(MODULE, `Routes set up`, LogType.SERVER)
}
