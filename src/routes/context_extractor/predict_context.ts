import express from "express"
import { requestContextPrediction } from "../../controllers/context_extractor/predict_context.js"

const router = express.Router()
router.post('/', requestContextPrediction)
export default router