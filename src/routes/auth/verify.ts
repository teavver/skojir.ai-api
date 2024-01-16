import express from "express"
import { verifyUser } from "../../controllers/user_controllers/verify.js"

const router = express.Router()
router.post("/", verifyUser)
export default router
