import {
    Router
} from "express";
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
     updateUserDataByUserId
} from "../controllers/userController.js";
import upload from "../config/multer.js";
const userRoutes = Router();

// Auth routes
userRoutes.post("/signup", signUpController);
userRoutes.post("/login", logInController);
userRoutes.post("/logout", logOutController);
// get user route
userRoutes.get("/:userId", getUserByUserId);
// Token routes
userRoutes.get("/refresh-access-token", refreshAccessTokenController);

// OTP routes
userRoutes.post("/verify-email-otp", verifyEmailOTPController);
userRoutes.post("/verify-password-otp", verifyPasswordOTPController);
userRoutes.post("/resend-email-otp", resendVerifyEmailOtpController);
userRoutes.post("/resend-password-otp", resendPasswordOtpController);

// Password routes
userRoutes.post("/forgot-password", forgotPasswordController);
userRoutes.post("/reset-password/:userId", resetPasswordController);
// update user details
userRoutes.put("/:userId",upload.single("profileImage"), updateUserDataByUserId)
export default userRoutes;