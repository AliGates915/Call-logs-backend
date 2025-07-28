import express from "express";
import {
  addMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  getMeetingsByCompany
} from "../controllers/meetingController.js";

const router = express.Router();

// CRUD routes
router.post("/", addMeeting);
router.get("/", getAllMeetings);
router.get("/:id", getMeetingById);
router.put("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);

// Additional routes
router.get("/company/:companyId", getMeetingsByCompany);

export default router;
