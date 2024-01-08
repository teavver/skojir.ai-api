// import { ServiceResponse } from "../../types/responses/ServiceResponse.js";
// import { logger, LogType } from "../../utils/logger.js";
// import { User } from "../../models/User.js";
// import { IUserVerified } from "../../types/interfaces/IUserVerified.js";
// import { GetUserResponse } from "../../types/responses/GetUserResponse.js";
// import { emailSchema } from "../../middlewares/validators/schemas/emailSchema.js";
// import { IMembership } from "../../types/interfaces/IMembership.js";

// const MODULE = "services :: user_services :: getUser"

// export async function getUser(userEmailQuery: string): Promise<ServiceResponse<GetUserResponse>> {

//     try {
//         await emailSchema.validateAsync(userEmailQuery)
//     } catch (err) {
//         const errMsg = (err as Error).message
//         return {
//             err: true,
//             errMsg: errMsg,
//             statusCode: 400
//         }
//     }

//     const user = await User.findOne({ email: userEmailQuery }).populate({
//         path: 'membershipDetails',
//         match: { _id: { $exists: true } }
//     }) as IUserVerified | null

//     console.log(user)

//     if (!user) {
//         return {
//             err: true,
//             errMsg: `User not found.`,
//             statusCode: 404
//         }
//     }

//     logger(MODULE, `Get User: ${user.email}`, LogType.SUCCESS)
//     // let userData: GetUserResponse = {
//         // email: user.email
//     // }
    
//     // if (user.membershipDetails) {
//     //     const membershipData = user.membershipDetails as IMembership
//     //     userData.membership = {
//     //         userId: undefined,
//     //         isActive: membershipData.isActive,
//     //         endDate: membershipData.endDate
//     //     }
//     // }
    
//     return {
//         err: false,
//         data: userData,
//         statusCode: 200
//     }
// }