import IUserCredentials from "../../interfaces/IUserCredentials";
import { AuthRequest } from "./AuthRequest";

export interface AuthCredentialsRequest extends AuthRequest, IUserCredentials {}