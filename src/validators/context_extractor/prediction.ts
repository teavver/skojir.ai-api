import { PredictionRequest } from "../../models/context_extractor/prediction.js"

export const validatePredictionRequest = (req: PredictionRequest): boolean => {
    // keys [threshold, img] present
    if (req.threshold === undefined || req.img === undefined) return false
    // typecheck
    if (typeof req.threshold !== 'number' || typeof req.img !== 'string') return false
    // is threshold key in expected range?
    if (!Number.isFinite(req.threshold) || req.threshold < 0.1 || req.threshold > 0.5) return false
    return true
}