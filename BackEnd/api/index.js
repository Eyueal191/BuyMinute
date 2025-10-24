// api/index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import serverless from "serverless-http";

import { ensureAuthenticated } from "../middleware/auth.js";
import {
  userRoutes,
  productRoutes,
  cartRoutes,
  orderRoutes,
} from "../routes/index.js";

// Load environment variables
dotenv.config();

const app = express();

// --------------------
// Lazy DB Connection (for serverless)
// --------------------
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    cached.conn = conn;
    console.log("✅ MongoDB connected");
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}

// --------------------
// CORS
// --------------------
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// --------------------
// Middleware
// --------------------
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// --------------------
// Ensure DB connection on each request
// --------------------
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection middleware failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// --------------------
// Routes
// --------------------
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.use("/api/cart", async (req, res, next) => {
  try {
    await ensureAuthenticated(req, res, next);
  } catch (err) {
    console.error("Cart auth failed:", err);
    res.status(401).json({ error: "Authentication failed" });
  }
}, cartRoutes);

app.use("/api/order", async (req, res, next) => {
  try {
    await ensureAuthenticated(req, res, next);
  } catch (err) {
    console.error("Order auth failed:", err);
    res.status(401).json({ error: "Authentication failed" });
  }
}, orderRoutes);

// --------------------
// Export for Vercel
// --------------------
// ❗ Vercel requires a *default export* (not a named one)
export default serverless(app);
