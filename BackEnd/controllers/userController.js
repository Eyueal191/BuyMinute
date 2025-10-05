import User from "../models/user.js";
import {
    hashPassword,
    comparePassword
} from "../utility/bcrypt.js";
import sendEmail from "../config/resend.js";
import {
    generateAccessToken,
    generateRefreshToken
} from "../utility/generateToken.js";
import otpTemplate from "../utility/otpTemplate.js";
import uploadMultipleFiles from "../utility/uploadMultipleFiles.js";
import cloudinary from "../config/cloudinary.js";
let test = true;
// 1. Sign Up Controller
const signUpController = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email has already registered",
                error: true,
                success: false,
            });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();

        const userId = savedUser._id;
        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);

        const verifyEmailOTP = Math.floor(Math.random() * 9000 + 1000);
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        const linkUrl = `${process.env.FRONTEND_URL}verify-email-otp?code=${verifyEmailOTP}`
        await sendEmail({
            to: email,
            subject: "Verify your email address",
            html: otpTemplate(verifyEmailOTP, linkUrl),
        });
        await User.findByIdAndUpdate(userId, {
            accessToken,
            refreshToken,
            verifyEmailOTP,
            verifyEmailOTPExpiry: otpExpiry,
        });
        res.status(201).json({
            message: "Registered successfully",
            error: false,
            success: true,
            email
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
// 2. Log In Controller
const logInController = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });
        if (!user) {
            console.log("logIn hitted successfully")
            return res.status(404).json({
                message: "Unregistered email",
                error: true,
                success: false,
            });
        }

        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Incorrect Password",
                error: true,
                success: false,
            });
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };
        res.cookie("refreshToken", user.refreshToken, cookieOptions);
        console.log("userId", user._id)
        res.status(200).json({
            message: "Logged in successfully",
            error: false,
            success: true,
            accessToken: user.accessToken,
            userId:user._id.toString(),
            userEmail:user.email,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
const verifyEmailOTPController = async (req, res) => {
    console.log("Request received for OTP verification");

    try {
        const {
            email,
            otp
        } = req.body || {};
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }
        console.log("Received email:", email);
        console.log("Received OTP:", otp);

        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        // Check if OTP matches
        if (Number(user.verifyEmailOTP) !== Number(otp)) {
            return res.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false,
            });
        }

        // Check if OTP is expired
        if (user.verifyEmailOTPExpiry && user.verifyEmailOTPExpiry < Date.now()) {
            return res.status(400).json({
                message: "OTP expired",
                error: true,
                success: false,
            });
        }

        // Mark email as verified
        user.verified = true;
        user.verifyEmailOTP = undefined; // clear OTP
        user.verifyEmailOTPExpiry = undefined;
        await user.save();

        return res.status(200).json({
            message: "Email verified successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
};
// 4. Verify Password OTP
const verifyPasswordOTPController = async (req, res) => {
    try {
        const {
            email,
            otp
        } = req.body;
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (Number(user.verifyPasswordOTP) === Number(otp)) {
            return res.status(200).json({
                message: "Verified successfully",
                error: false,
                success: true
            });
        }

        res.status(400).json({
            message: "Invalid verification code",
            error: true,
            success: false
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
// 5. Forgot Password
const forgotPasswordController = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                message: "Unregistered",
                error: true,
                success: false
            });
        }
        const otp = Math.floor(Math.random() * 9000 + 1000);
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        user.verifyPasswordOTP = otp;
        user.verifyPasswordOTPExpiry = otpExpiry;
        await user.save();

        await sendEmail({
            to: email,
            subject: "Password Reset Code",
            html: otpTemplate(otp)
        });

        res.status(200).json({
            message: "Password reset code sent to your email",
            error: false,
            success: true,
            code:otp
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
// 6. Refresh Access Token
const refreshAccessTokenController = async (req, res) => {
    try {
        res.status(200).json({
            message: "Refresh Access Token endpoint is ready"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
// 7. Reset Password
const resetPasswordController = async (req, res) => {
    try {
        const {
            password
        } = req.body;

        let {userId}=req.params;

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "Unregisted user",
                error: true,
                success: false
            });
        }
        user.password = await hashPassword(password);
        await user.save();
        res.status(200).json({
            message: "Password has been reset successfully",
            error: false,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
// 8. Resend Password OTP
const resendPasswordOtpController = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const otp = Math.floor(Math.random() * 9000 + 1000);
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        user.verifyPasswordOTP = otp;
        user.verifyPasswordOTPExpiry = otpExpiry;
        await user.save();

        await sendEmail({
            to: email,
            subject: "Password Reset Code",
            html: otpTemplate(otp)
        });

        res.status(200).json({
            message: "Password reset code sent to your email",
            error: false,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
// 9. Resend Verify Email OTP
const resendVerifyEmailOtpController = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const otp = Math.floor(Math.random() * 9000 + 1000);
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        user.verifyEmailOTP = otp;
        user.verifyEmailOTPExpiry = otpExpiry;
        await user.save();

        await sendEmail({
            to: email,
            subject: "Verify Email Code",
            html: otpTemplate(otp)
        });

        res.status(200).json({
            message: "Verify email code sent to your email",
            error: false,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
// 10. Logout Controller
const logOutController = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        user.accessToken = "";
        user.refreshToken = "";
        await user.save();

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });
        res.status(200).json({
            message: "Logged out successfully",
            error: false,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
const getUserByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId }).lean();

        if (!user) 
            return res.status.json(404).json({ 
                message: "User not found", 
                success: true, 
                error: false 
            });

        return res.status(200).json({ 
            message: "user data has been retrieved successfully", 
            error: false, 
            success: true, 
            user 
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
const updateUserDataByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userUpdate = JSON.parse(req.body.data);

    // Upload profile image only if provided
    let profileImage;
    if (req.file) {
      profileImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "userProfiles" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        ).end(req.file.buffer);
      });
    }

    // Fetch user
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // Merge updates
    Object.assign(user, userUpdate);
    if (profileImage) {
      user.profileImage = profileImage;
    }

    // Save updated user
    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User data has been updated successfully",
      error: false,
      success: true,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
};
export {
    updateUserDataByUserId,
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
};