import { SolverOutputFormat } from "./requests/client/SolveRequest.js"
import { VisionRequest } from "./requests/VisionRequest.js"

/**
 * Dict type for default GPT settings used in sendVisionPrompt service
 */

export type GPTSettings = {
    [key in SolverOutputFormat]: VisionRequest
}