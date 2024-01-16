import { Document } from "mongoose"
import { IUserUnverified } from "../types/interfaces/IUserUnverified"
import { IUserVerified } from "../types/interfaces/IUserVerified"

export function isUserVerified(user: IUserVerified | IUserUnverified | Document): user is IUserVerified {
    return (user as IUserVerified).isEmailVerified === true
}
