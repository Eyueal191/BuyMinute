import { Router } from "express";
import upload from "../config/multer.js";
import {
  getUserByUserId,
  signUpController,
  logInController,
  verifyEmailOTPController,
  verifyPasswordOTPController,
  forgotPasswordController,
  refreshAccessTokenController,
  resetPasswordController,
  resendPasswordOtpController,
  resendVerifyEmailOtpController,
  logOutController,
  updateUserDataByUserId,
} from "../controllers/userController.js";

const userRoutes = Router();

// ----------------------
// Auth Routes
// ----------------------
userRoutes.post("/signup", signUpController);
userRoutes.post("/login", logInController);
userRoutes.post("/logout", logOutController);

// ----------------------
// Token Routes
// ----------------------
userRoutes.get(
  "/refresh-access-token",
  refreshAccessTokenController
);

// ----------------------
// OTP Routes
// ----------------------
userRoutes.post("/verify-email-otp", verifyEmailOTPController);
userRoutes.post("/verify-password-otp", verifyPasswordOTPController);
userRoutes.post("/resend-email-otp", resendVerifyEmailOtpController);
userRoutes.post("/resend-password-otp", resendPasswordOtpController);

// ----------------------
// Password Routes
// ----------------------
userRoutes.post("/forgot-password", forgotPasswordController);
userRoutes.post("/reset-password/:userId", resetPasswordController);

// ----------------------
// Update User Details
// ----------------------
userRoutes.put(
  "/:userId",
  upload.single("profileImage"),
  updateUserDataByUserId
);

// ----------------------
// Dynamic User Route (should always be last)
// ----------------------
userRoutes.get("/:userId", getUserByUserId);

export default userRoutes;
