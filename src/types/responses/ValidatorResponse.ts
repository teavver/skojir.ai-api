interface SuccessfulValidation<T> {
    isValid: true
    data: T
}

interface FailedValidation {
    isValid: false
    error: string
    statusCode: 400
}

export type ValidatorResponse<T> = SuccessfulValidation<T> | FailedValidation