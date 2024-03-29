import express from "express"
import { solveScreenshot } from "../controllers/solve.js"
import { verifyToken } from "../middlewares/auth/verifyToken.js"

const router = express.Router()
router.post("/", verifyToken("accessToken"), solveScreenshot)
export default router
