import express from "express";
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import {authenticate, requireAdmin } from '../config/middleware.js';
import { 
  addProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  removeProductImage,
  getProductsByMonth
} from "../controllers/productController.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage });

// Product routes
// Admin only routes (create, update, delete)
router.post("/", authenticate, requireAdmin, upload.array('image', 1), addProduct);
router.put("/:id", authenticate, requireAdmin, upload.array('image', 1), updateProduct);
router.delete("/:id", authenticate, requireAdmin, deleteProduct);
router.delete("/:productId/images/:publicId", authenticate, requireAdmin, removeProductImage);

// Routes accessible to active users (read operations)
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/analytics/monthly", getProductsByMonth);

export default router;
