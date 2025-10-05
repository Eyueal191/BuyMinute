import React, { useEffect } from "react";
import { Form, useActionData, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ForgotPassword() {
  const data = useActionData();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.success) {
      toast.success(data.message, { duration: 4000 });
      setTimeout(() => navigate("/verify-password-otp"), 1000);
    } else if (data?.error) {
      toast.error(data.error, { duration: 4000 });
    }
  }, [data]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Reset Your Password
        </h2>

        {/* Form */}
        <Form className="space-y-5" method="post">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium mb-2 text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Send Reset Link
          </button>
        </Form>

        {/* Helper Text */}
        <p className="text-gray-500 mt-4 text-center text-sm md:text-base">
          Enter your email and we’ll send you instructions to reset your password.
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
