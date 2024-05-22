import express from "express"
import { pwdChange } from "../../controllers/user_controllers/pwdChange.js"
import { verifyToken } from "../../middlewares/auth/verifyToken.js"

const router = express.Router()
router.post("/", verifyToken("accessToken"), pwdChange)
export default router
