import { Types } from "mongoose"

export default interface IUserBase {
    _id: Types.ObjectId
    email: string
}