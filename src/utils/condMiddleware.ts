import { RequestHandler, Request, Response, NextFunction } from "express"

/**
 * Conditionally applies middleware based on the ENV app setup
 */
export function conditionalMiddleware(middleware: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        if (process.env.ENV === "DEV") {
            return next()
        } else {
            return middleware(req, res, next)
        }
    }
}
