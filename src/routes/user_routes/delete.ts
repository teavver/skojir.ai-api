import express from "express";
import { deleteUser } from "../../controllers/user_controllers/delete.js";
import { verifyToken } from "../../middlewares/auth/verifyToken.js";

const router = express.Router()
router.post("/", verifyToken, deleteUser)
export default router