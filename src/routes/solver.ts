import express from "express"
import { solveScreenshot } from "../controllers/solver.js"

const router = express.Router()
router.post("/", solveScreenshot)
export default router