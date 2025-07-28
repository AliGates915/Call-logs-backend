import express from "express";
import { register, login, updateUserStatus, deleteUser, getAllUsers } from "../controllers/authController.js";


const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id",  deleteUser);

export default router;
