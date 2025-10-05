const authApiSummary = {
  signUp: {
    method: "POST",
    route: "/api/user/signup",
    description: "Register a new user with email and password."
  },
  logIn: {
    method: "POST",
    route: "/api/user/login",
    description: "Log in a user and return access token + set refresh token in cookie."
  },
  logOut: {
    method: "POST",
    route: "/api/user/logout",
    description: "Log out user by clearing access & refresh tokens and clearing cookie."
  },
  refreshAccessToken: {
    method: "GET",
    route: "/api/user/refresh-access-token",
    description: "Refresh the access token using the refresh token cookie."
  },
  verifyEmailOtp: {
    method: "POST",
    route: "/api/user/verify-email-otp",
    description: "Verify the email OTP sent to user during signup."
  },
  verifyPasswordOtp: {
    method: "POST",
    route: "/api/user/verify-password-otp",
    description: "Verify the OTP sent for password reset."
  },
  resendEmailOtp: {
    method: "POST",
    route: "/api/user/resend-email-otp",
    description: "Resend email verification OTP to the user."
  },
  resendPasswordOtp: {
    method: "POST",
    route: "/api/user/resend-password-otp",
    description: "Resend password reset OTP to the user."
  },
  forgotPassword: {
    method: "POST",
    route: "/api/user/forgot-password",
    description: "Initiate forgot password by sending OTP to email."
  },
  resetPassword: {
    method: "POST",
    route: "/api/user/reset-password",
    description: "Reset password after verifying OTP."
  }
};

export default authApiSummary;