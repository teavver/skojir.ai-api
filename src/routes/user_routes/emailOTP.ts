import express from "express"
import { emailOTP } from "../../controllers/user_controllers/emailOTP.js"

const router = express.Router()
router.post("/", emailOTP)
export default router