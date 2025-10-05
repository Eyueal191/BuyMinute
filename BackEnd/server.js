import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import {
    userRoutes, productRoutes,
    cartRoutes, orderRoutes
} from "./routes/index.js";
dotenv.config();

const app = express();

app.use(
    cors({
        origin: true,
        credentials: true,
    })
); // used to override the same origin policy.
app.use(express.json()); // to parse json data to plain js data in the request.body.
app.use(cookieParser()); // to parse the cookie make them from request.headers.cookie to request.cookie.
app.use(morgan("dev")); // used to log the request.
app.use(helmet({
    crossOriginResourcePolicy: false
})); // used to apply all security headers on the response.

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
const PORT = process.env.PORT || 8080;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on", PORT);
    });
}).catch((err) => {
    console.error("Failed to connect to DB", err);
});