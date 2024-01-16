import express from "express"
import { emailChangeOTP } from "../../controllers/user_controllers/emailChangeOTP.js"
import { verifyToken } from "../../middlewares/auth/verifyToken.js"

const router = express.Router()
router.get("/", verifyToken("accessToken"), emailChangeOTP)
export default router
