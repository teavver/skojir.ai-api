import { ResponseMessage, ResponseState } from "./ResponseMessage.js";
import { UserAuthTokens } from "../AuthToken.js";

export interface LoginResponse extends ResponseMessage {
    // Include token data only when state is 'success'
    data?: ResponseState extends 'success' ? UserAuthTokens : never
}