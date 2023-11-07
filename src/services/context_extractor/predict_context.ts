import { PredictionRequest } from "../../models/context_extractor/prediction.js"
import { validatePredictionRequest } from "../../validators/context_extractor/prediction.js"
import { logger } from "../../utils/logger.js"

const MODULE = "services :: context_extractor :: predict_context"

export const requestContextPrediction = (req: PredictionRequest) => {
    const valid = validatePredictionRequest(req)
    if (!valid) {
        logger(MODULE, "Failed to validate prediction request", )
    }

    // actual request to GCF
}