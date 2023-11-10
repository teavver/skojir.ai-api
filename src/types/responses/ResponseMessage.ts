
export type ResponseState = "success" | "error" | "notfound" | "unauthorized" | "conflict"

export interface ResponseMessage {
    state: ResponseState
    message?: string
}