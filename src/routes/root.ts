import express from "express"
import { getRoot } from "../controllers/root.js"

const router = express.Router()
router.get("/", getRoot)
export default router
