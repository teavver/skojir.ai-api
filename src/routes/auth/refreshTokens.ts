import express from "express";
import { verifyToken } from "../../middlewares/auth/verifyToken.js";
import { refreshAuthTokens } from "../../controllers/refreshAuthTokens.js";

const router = express.Router()
router.post("/", verifyToken("refreshToken"), refreshAuthTokens)
export default router