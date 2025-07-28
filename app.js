import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import staffRoutes from "./routes/staffRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import followUpRoutes from "./routes/followUpRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

dotenv.config();

const app = express();

// CORS setup
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:8081',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
};
app.use(cors(corsOptions));


// All other routes use JSON
app.use(express.json());

// Connect DB
connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/follow-ups", followUpRoutes);

app.get("/", (req, res) => {
  res.send("API is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
