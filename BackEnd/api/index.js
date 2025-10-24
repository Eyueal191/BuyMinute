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

dotenv.config();
const app = express();

// --------------------
// Lazy Database Connection for Serverless
// --------------------
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    cached.conn = conn;
    console.log("MongoDB connected");
    return conn;
  } catch (err) {
    console.error("DB connection failed", err);
    throw err;
  }
}

// --------------------
// CORS Setup
// --------------------
app.use(
  cors({
    origin: (origin, callback) => callback(null, true), // allow all origins
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
// Ensure DB connection per request
// --------------------
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "DB connection failed" });
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
    console.error(err);
    res.status(401).json({ error: "Authentication failed" });
  }
}, cartRoutes);

app.use("/api/order", async (req, res, next) => {
  try {
    await ensureAuthenticated(req, res, next);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Authentication failed" });
  }
}, orderRoutes);

// --------------------
// Export handler for Vercel
// --------------------
export const handler = serverless(app);
