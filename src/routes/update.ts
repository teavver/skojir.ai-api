import express from "express"
import { postUpdate } from "../controllers/update.js"

const router = express.Router()
router.get("/", postUpdate)
export default router