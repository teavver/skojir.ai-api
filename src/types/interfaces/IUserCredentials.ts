import IUserBase from "./IUserBase.js";
import IUserPassword from "./IUserPassword.js";

export default interface IUserCredentials extends IUserBase, IUserPassword {}