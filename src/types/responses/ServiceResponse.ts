interface SuccessfulServiceResponse<T> {
    err: false
    data: T // Services should pass validated request body back to controllers on success.
    statusCode: number
}

interface FailedServiceResponse {
    err: true
    errMsg: string
    statusCode: number
}

export type ServiceResponse<T> = SuccessfulServiceResponse<T> | FailedServiceResponse