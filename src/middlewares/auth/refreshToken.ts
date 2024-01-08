import jwt from "jsonwebtoken"
import { Request } from "express"
import { User } from "../../models/User.js"
import { generateAuthToken } from "./genToken.js"
import { IUserVerified } from "../../types/interfaces/IUserVerified.js"
import { ServiceResponse } from "../../types/responses/ServiceResponse.js"

const MODULE = "middlewares :: auth :: refreshToken"

export async function refreshToken(req: Request) {
    
    // const refreshToken = req.body.refreshToken
    // if (!refreshToken) {
    //     return {
    //         err: true,
    //         errMsg: `Refresh token is required`
    //     }
    // }

    // try {

    //     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload

    //     const user = await User.findById(userId)
    //     if (!user) {
    //         return {
    //             err: true,
    //             errMsg: `User not found`
    //         }
    //     }

    //     if (!user.isEmailVerified) {
    //         return {
    //             err: true,
    //             errMsg: `User email is not verified yet`
    //         }
    //     }

    //     const newAccessToken = generateToken((user as IUserVerified), "accessToken")
    //     return {
    //         err: false,
    //         data: newAccessToken
    //     }

    // } catch (err) {
    //     const errMsg = (err as Error).message
    //     logger(MODULE, `Err while generating a refreshToken: ${errMsg}`, LogType.WARN)
    //     return {
    //         err: true,
    //         errMsg: errMsg
    //     }
    // }

}