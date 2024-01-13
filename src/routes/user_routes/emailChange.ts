import express from "express"
import { emailChange } from "../../controllers/user_controllers/emailChange.js"
import { verifyToken } from "../../middlewares/auth/verifyToken.js"

const router = express.Router()
router.post("/", verifyToken("accessToken"), emailChange)
export default router