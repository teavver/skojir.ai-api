import { Document } from "mongoose";
import { IUserUnverified } from "../types/express/interfaces/IUserUnverified";
import { IUserVerified } from "../types/express/interfaces/IUserVerified";

export function isUserVerified(user: IUserVerified | IUserUnverified | Document): user is IUserVerified {
    return (user as IUserVerified).isEmailVerified === true
}