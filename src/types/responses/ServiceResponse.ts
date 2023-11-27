interface SuccessfulServiceResponse {
    err: false
    data: string
}

interface FailedServiceResponse {
    err: true
    errMsg: string
}

export type ServiceResponse = SuccessfulServiceResponse | FailedServiceResponse