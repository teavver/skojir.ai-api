interface SuccessfulValidation {
    isValid: true
    data: Object
}

interface FailedValidation {
    isValid: false
    error: string
    statusCode: number
}

export type ValidatorResponse = SuccessfulValidation | FailedValidation