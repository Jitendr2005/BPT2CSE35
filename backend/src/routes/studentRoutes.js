import { Router } from "express";
import {
  getClassAnalytics,
  getStudentDashboard,
  listStudents,
  updateOwnProfile,
  upsertStudentByTeacher
} from "../controllers/studentController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);

router.get("/me", authorize("student"), asyncHandler(getStudentDashboard));
router.put("/me", authorize("student"), asyncHandler(updateOwnProfile));
router.get("/", authorize("teacher"), asyncHandler(listStudents));
router.get("/analytics/class", authorize("teacher"), asyncHandler(getClassAnalytics));
router.put("/:studentId", authorize("teacher"), asyncHandler(upsertStudentByTeacher));

export default router;
