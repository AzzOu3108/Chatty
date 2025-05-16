import express from "express";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/messageController";
import { protectRoute } from "../middleware/authMiddleware";

const router = express.Router()

router.get("/users", protectRoute, getUserForSidebar)
router.get("/:id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, sendMessage)

export default router;