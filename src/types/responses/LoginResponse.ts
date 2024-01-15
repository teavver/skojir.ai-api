import { UserTokens } from "../AuthToken.js";
import { ResponseMessage, ResponseState } from "./ResponseMessage.js";

export interface SuccessLoginResponse extends ResponseMessage {
    state: 'success'
    tokens: UserTokens
}

export interface ErrorLoginResponse extends ResponseMessage {
    state: Exclude<ResponseState, 'success'>
    message: string
}

export type LoginResponse = SuccessLoginResponse | ErrorLoginResponse;
