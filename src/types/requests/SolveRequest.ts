import { PredictionRequest } from "./PredictionRequest.js"

export const validOutputFormats = ["minimal", "standard"] as const
export type SolverOutputFormat = typeof validOutputFormats[number]

export interface SolveRequest extends PredictionRequest {
    outputFormat: SolverOutputFormat
}