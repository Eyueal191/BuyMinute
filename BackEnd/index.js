// api/index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/connectDB.js";

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

// --------------------s
// Middleware
// --------------------s
// ✅ Allow all origins dynamically (for development/testing)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow requests without origin (e.g. Postman)
      console.log("🌍 CORS request from:", origin); // optional, for debugging
      return callback(null, true); // dynamically allow all origins
    },
    credentials: true, // ✅ enables cookies, tokens, etc.
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/order",orderRoutes);

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
