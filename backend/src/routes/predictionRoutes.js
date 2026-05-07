import { Router } from "express";
import {
  predictOwnPerformance,
  predictPerformance
} from "../controllers/predictionController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(predictPerformance));
router.get("/me", authenticate, authorize("student"), asyncHandler(predictOwnPerformance));

export default router;
