import IUserVerification from "../../interfaces/IUserVerification.js";
import { AuthRequest } from "./AuthRequest.js";

export interface AuthVerificationRequest extends AuthRequest, IUserVerification {}
