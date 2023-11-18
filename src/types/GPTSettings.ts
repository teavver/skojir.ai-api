import { SolverOutputFormat } from "./requests/SolveRequest.js"
import { VisionRequest } from "./requests/VisionRequest.js"

/**
 * Dict type for default GPT settings used in 
 */

export type GPTSettings = {
    [key in SolverOutputFormat]: VisionRequest
}