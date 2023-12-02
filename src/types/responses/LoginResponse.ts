import { ResponseMessage, ResponseState } from "./ResponseMessage.js";
import { UserAuthTokens } from "../AuthToken.js";

export interface SuccessLoginResponse extends ResponseMessage {
    state: 'success'
    data: UserAuthTokens
}

export interface ErrorLoginResponse extends ResponseMessage {
    state: Exclude<ResponseState, 'success'>
    message: string
}

export type LoginResponse = SuccessLoginResponse | ErrorLoginResponse;
