import express from "express";
import { accountInfo } from "../../controllers/user_controllers/accountInfo.js";
import { verifyToken } from "../../middlewares/auth/verifyToken.js";

const router = express.Router()
router.get("/", verifyToken, accountInfo)
export default router