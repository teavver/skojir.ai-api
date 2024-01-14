import { IUserBase } from "./IUserBase.js";
import { IUserPassword } from "./IUserPassword.js";
import { IDeviceID } from "./IDeviceID.js";

export interface IUserCredentials extends IUserBase, IUserPassword {}

// ↓ Login endpoint specific type
export interface IUserCredentialsExt extends IUserCredentials, IDeviceID {}