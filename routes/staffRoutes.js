import express from "express";
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import {
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

import { requireAdmin } from '../config/middleware.js';

const router = express.Router();
const upload = multer({ storage });

router.post("/", requireAdmin, upload.single("image"), addStaff);
router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.put("/:id", requireAdmin, upload.single("image"), updateStaff);
router.delete("/:id", requireAdmin, deleteStaff);

export default router;
