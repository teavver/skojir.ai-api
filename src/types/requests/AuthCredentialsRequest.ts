import IUserCredentials from "../interfaces/IUserCredentials";
import { AuthRequest } from "./AuthRequest";

/**
 * Request type for requests to endpoints that require both JWT token auth and user credentials 
 */
export interface AuthCredentialsRequest extends AuthRequest, IUserCredentials {}