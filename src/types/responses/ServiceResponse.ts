interface SuccessfulServiceResponse {
    err: false
    data: Object | string // Object allows services to return Db documents; less dbOps
}

interface FailedServiceResponse {
    err: true
    errMsg: string
}

export type ServiceResponse = SuccessfulServiceResponse | FailedServiceResponse