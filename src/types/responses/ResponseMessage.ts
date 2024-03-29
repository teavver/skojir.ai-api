import { UserTokens } from "../AuthToken"
import { AccountInfoResponse } from "./AccountInfoResponse"

export type ResponseState = "success" | "error" | "notfound" | "unauthorized" | "conflict"

export interface ResponseMessage {
    state: ResponseState
    message?: string
}

export interface ResponseMessageExt extends ResponseMessage {
    user?: AccountInfoResponse
    tokens?: UserTokens
}
