import express from "express";
import multer from 'multer';
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
const upload = multer({ dest: 'uploads/' });

// Product routes
router.post("/", upload.array('image', 1), addProduct); // Allow image
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array('image', 1), updateProduct);
router.delete("/:id", deleteProduct);
router.delete("/:productId/images/:publicId", removeProductImage);

router.get("/analytics/monthly", getProductsByMonth);
export default router;
