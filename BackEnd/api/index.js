import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "../config/connectDB.js";
import { ensureAuthenticated } from "../middleware/auth.js";
import {
  userRoutes,
  productRoutes,
  cartRoutes,
  orderRoutes,
} from "../routes/index.js";
import serverless from "serverless-http";

dotenv.config();
const app = express();

// --------------------
// CORS Setup (allow any origin)
// --------------------
app.use(
  cors({
    origin: "*",   // allow all origins
    // credentials: true // ⚠️ if using cookies, you cannot set origin: "*"
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
// Routes
// --------------------
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", ensureAuthenticated, cartRoutes);
app.use("/api/order", ensureAuthenticated, orderRoutes);

// --------------------
// Database connection
// --------------------
connectDB().catch((err) => {
  console.error("Failed to connect to DB", err);
});

// --------------------
// Export handler for Vercel
// --------------------
export const handler = serverless(app);
