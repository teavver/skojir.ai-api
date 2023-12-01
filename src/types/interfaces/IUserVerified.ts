import IUserCredentials from "./IUserCredentials.js";
import IMembership from "./IMembership.js";

export interface IUserVerified extends IUserCredentials {
    salt: string
    isEmailVerified: true
    membershipDetails?: IMembership
}