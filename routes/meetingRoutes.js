import express from "express";
import {
  addMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  getMeetingsByCompany
} from "../controllers/meetingController.js";
import { authenticate, requireAdmin } from "../config/middleware.js";
const router = express.Router();

// CRUD routes
router.post("/", authenticate, requireAdmin, addMeeting);
router.get("/", getAllMeetings);
router.get("/:id", getMeetingById);
router.put("/:id", authenticate, requireAdmin, updateMeeting);
router.delete("/:id", authenticate, requireAdmin, deleteMeeting);

// Additional routes
router.get("/company/:companyId", getMeetingsByCompany);

export default router;
