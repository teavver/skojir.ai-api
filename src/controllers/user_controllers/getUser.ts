// import { Request, Response } from "express";
// import { logger, LogType } from "../../utils/logger.js";
// import { ResponseMessage } from "../../types/responses/ResponseMessage.js";
// import { getUser as getUserService } from "../../services/user_services/getUser.js";

// const MODULE = "controllers :: user_controllers :: getUser"

// export async function getUser(req: Request, res: Response<ResponseMessage>) {

//     const userEmailQuery = req.query.email as string
//     if (!userEmailQuery) {
//         const errMsg = "Missing email in query parameters"
//         logger(MODULE, errMsg, LogType.ERR);
//         return res.status(400).json({
//             state: "error",
//             message: errMsg
//         })
//     }

//     const userData = await getUserService(userEmailQuery)
//     if (userData.err) {
//         return res.status(userData.statusCode).json({
//             state: "error",
//             message: userData.errMsg
//         })
//     }


//     logger(MODULE, `getUser: {}`, LogType.SUCCESS)
//     return res.status(200).json({
//         state: "success",
//         message: `OK`
//     })

// }