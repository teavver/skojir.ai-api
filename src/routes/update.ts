import express from "express"
import { performUpdate } from "../controllers/update.js"
import { verifyGH } from "../middlewares/auth/verifyGH.js"

const router = express.Router()
router.post("/", verifyGH, performUpdate)
export default router