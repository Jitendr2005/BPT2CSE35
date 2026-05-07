import { Router } from "express";
import { getChatHistory, sendMessage } from "../controllers/chatbotController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("student"));
router.get("/history", asyncHandler(getChatHistory));
router.post("/", asyncHandler(sendMessage));

export default router;
