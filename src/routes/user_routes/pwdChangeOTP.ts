import express from "express"
import { pwdChangeOTP } from "../../controllers/user_controllers/pwdChangeOTP.js"
import { verifyToken } from "../../middlewares/auth/verifyToken.js"

const router = express.Router()
router.get("/", verifyToken("accessToken"), pwdChangeOTP)
export default router
