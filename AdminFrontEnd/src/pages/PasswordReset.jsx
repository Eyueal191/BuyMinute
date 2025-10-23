import React, { useState, useRef } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Axios from "../axios/axios.config";
import { toast } from "react-toastify";

function PasswordReset() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isCPasswordShown, setIsCPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password = formData.get("password");
      const cpassword = formData.get("cpassword");

      if (password.toLowerCase() !== cpassword.toLowerCase()) {
        toast.error("Password and confirm password must match");
        return;
      }

      const payLoad = { email, password };
      const response = await Axios.post("/api/user/reset-password", payLoad);

      if (response.data.success) {
        formRef.current.reset();
        toast.success(response.data.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl 2xl:max-w-2xl bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-200 space-y-6">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 text-center">
          Reset Your Password
        </h2>

        {/* Form */}
        <Form method="post" ref={formRef} className="flex flex-col gap-5" onSubmit={submitHandler}>
          <label className="flex flex-col text-gray-700 text-sm sm:text-base">
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 placeholder-gray-400 transition"
              required
            />
          </label>

          <label className="flex flex-col text-gray-700 text-sm sm:text-base relative">
            New Password
            <input
              type={isPasswordShown ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="mt-1 p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 placeholder-gray-400 transition pr-10"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsPasswordShown((prev) => !prev)}
            >
              {isPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          <label className="flex flex-col text-gray-700 text-sm sm:text-base relative">
            Confirm Password
            <input
              type={isCPasswordShown ? "text" : "password"}
              name="cpassword"
              placeholder="Confirm your password"
              className="mt-1 p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 placeholder-gray-400 transition pr-10"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsCPasswordShown((prev) => !prev)}
            >
              {isCPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform shadow-md mt-2"
          >
            Reset
          </button>

          <p className="text-gray-500 text-sm sm:text-base text-center mt-4">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
export default PasswordReset;
