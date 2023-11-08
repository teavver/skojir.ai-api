import { PredictionRequest } from "../../models/context_extractor/prediction.js"
import { validatePredictionRequest } from "../../middlewares/validators/context_extractor/prediction.js"
import { logger, LogType } from "../../utils/logger.js"

const MODULE = "services :: context_extractor :: predict_context"

export async function requestContextPrediction(req: PredictionRequest) {

    const valid = await validatePredictionRequest(req)
    if (!valid) {
        return logger(MODULE, "Failed to validate prediction request", LogType.ERR)
    }


    try {
    
        

    } catch (err) {
        
    }    

}