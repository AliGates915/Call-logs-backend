import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token. User not found." 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token." 
    });
  }
};

// Middleware to check if user is admin
export const requireAdmin = async (req, res, next) => {
  try {
    // First verify the token
    await verifyToken(req, res, (err) => {
      if (err) return next(err);
    });

    // Check if user is admin
    if (!req.user.isAdmin && req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }


    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Server error in admin verification." 
    });
  }
};


