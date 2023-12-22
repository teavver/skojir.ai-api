interface SuccessfulValidation<T> {
    isValid: true
    data: T
}

interface FailedValidation {
    isValid: false
    error: string
    statusCode: number
}

export type ValidatorResponse<T> = SuccessfulValidation<T> | FailedValidation