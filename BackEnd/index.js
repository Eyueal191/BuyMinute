// api/index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import { ensureAuthenticated } from "./middleware/auth.js";
import {
  userRoutes,
  productRoutes,
  cartRoutes,
  orderRoutes,
} from "./routes/index.js";

// Load environment variables
dotenv.config();

const app = express();

// --------------------
// MongoDB Connection
// --------------------
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // allow frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// --------------------
// Routes
// --------------------
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", ensureAuthenticated, cartRoutes);
app.use("/api/order", ensureAuthenticated, orderRoutes);

// --------------------
// Root route
// --------------------
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
