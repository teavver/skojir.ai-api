import express from "express"
import { checkStatus } from "../controllers/status.js"

const router = express.Router()
router.get("/", checkStatus)
export default router
