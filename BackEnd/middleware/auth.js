import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
dotenv.config();
// Middleware: ensures user is logged in.
export const ensureAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']; // lowercase.
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing" });
    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "Token missing" });
    // Verify access token.
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user; // attach user.
    next();
  } catch (error) {
    // If access token expired, return a specific message so Axios interceptor can refresh it
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token has expired" });
    }
return res.status(403).json({ message: "Invalid token", error: error.message });
  }
};
// Middleware: ensures user is admin
export const ensureAuthenticatedAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isAdmin) return res.status(403).json({ message: "Admins only" });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token has expired" });
    }
    return res.status(403).json({ message: "Invalid token", error: error.message });
  }
};
