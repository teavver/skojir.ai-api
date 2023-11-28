interface SuccessfulValidation {
    isValid: true
    data: Object
}

interface FailedValidation {
    isValid: false
    error: string
}

export type ValidatorResponse = SuccessfulValidation | FailedValidation