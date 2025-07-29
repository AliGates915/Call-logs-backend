import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally, fetch user from DB for latest info:
    // const user = await User.findById(decoded.id);
    // req.user = user;
    req.user = decoded; // If your token already contains isAdmin/role
    next();
    console.log("authenticate",req.user);
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};


// Middleware to check if user is admin
export const requireAdmin = async (req, res, next) => {
  try {
    console.log("admin",req.user);
    // Allow only if user is admin (either isAdmin true or role is "admin")
    if (req.user && (req.user.isAdmin === true)) {
      return next();
    } else {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required."
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Server error in admin verification."
    });
  }
};


// Middleware to check if user is staff
export const requireStaff = async (req, res, next) => {

  try {
    console.log(req.user);
    // Allow both "user" and "admin" if you want admins to access too
    if (req.user && (req.user.isAdmin === false || req.user.isAdmin === true)) {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Staff privileges required."
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error in staff verification."
    });
  }
};


