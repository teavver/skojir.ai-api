import express from "express"
import { emailChange } from "../../controllers/user_controllers/emailChange.js"

const router = express.Router()
router.post("/", emailChange)
export default router