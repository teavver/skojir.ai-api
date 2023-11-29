import express from "express"
import { solveScreenshot } from "../controllers/solve.js"

const router = express.Router()
router.post("/", solveScreenshot)
export default router