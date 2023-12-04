interface SuccessfulServiceResponse {
    err: false
    data: Object | string // Object allows services to return Db documents; less dbOps
    statusCode: number
}

interface FailedServiceResponse {
    err: true
    errMsg: string
    statusCode: number
}

export type ServiceResponse = SuccessfulServiceResponse | FailedServiceResponse