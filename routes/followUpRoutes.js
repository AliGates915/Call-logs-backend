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
import { authenticate, requireAdmin } from "../config/middleware.js";
const router = express.Router();

// CRUD routes
router.post("/", authenticate, requireAdmin, addFollowUp);
router.get("/", getAllFollowUps);
router.get("/:id", getFollowUpById);
router.put("/:id", authenticate, requireAdmin, updateFollowUp);
router.delete("/:id", authenticate, requireAdmin, deleteFollowUp);

// Additional routes
router.get("/customer/:customerId", getFollowUpsByCustomer);
router.patch("/:id/toggle-status", authenticate, requireAdmin, toggleFollowUpStatus);

export default router;
