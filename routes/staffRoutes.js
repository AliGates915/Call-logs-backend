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

const router = express.Router();
const upload = multer({ storage });

router.post("/", upload.single("image"), addStaff);
router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.put("/:id", upload.single("image"), updateStaff);
router.delete("/:id", deleteStaff);

export default router;
