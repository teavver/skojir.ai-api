import { AuthRequest } from "./AuthRequest.js";
import IUserBase from "../../interfaces/IUserBase.js";

export interface AuthRequestBase extends AuthRequest, IUserBase {}