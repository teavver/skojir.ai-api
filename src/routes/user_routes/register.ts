import express from "express"
import { registerUser } from "../../controllers/user_controllers/register.js"

const router = express.Router()
router.post("/", registerUser)
export default router
