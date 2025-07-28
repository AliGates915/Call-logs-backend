import express from "express";
import {
  addFollowUp,
  getAllFollowUps,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
  getFollowUpsByCustomer,
  toggleFollowUpStatus
} from "../controllers/followUpController.js";

const router = express.Router();

// CRUD routes
router.post("/", addFollowUp);
router.get("/", getAllFollowUps);
router.get("/:id", getFollowUpById);
router.put("/:id", updateFollowUp);
router.delete("/:id", deleteFollowUp);

// Additional routes
router.get("/customer/:customerId", getFollowUpsByCustomer);
router.patch("/:id/toggle-status", toggleFollowUpStatus);

export default router;
