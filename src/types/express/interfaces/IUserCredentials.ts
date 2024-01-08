import { IUserBase } from "./IUserBase.js";
import { IUserPassword } from "./IUserPassword.js";

export interface IUserCredentials extends IUserBase, IUserPassword {}