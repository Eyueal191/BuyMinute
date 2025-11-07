import React, { useState, useRef } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Axios from "../axios/axios.config.js";
import { toast } from "react-toastify";

function LogIn() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const email = formData.get("email")?.trim();
    const password = formData.get("password")?.trim();

    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const payload = { email, password };
      const { data } = await Axios.post("/api/user/login", payload);

      if (data.success) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", data.userEmail);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("loggedIn", true);

        toast.success(data.message || "Logged in successfully!");
        formRef.current.reset();
        navigate("/");
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl border border-gray-100">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 text-center leading-tight mb-3">
          Admin Login
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg text-center mb-10 leading-relaxed">
          Enter your credentials to access your dashboard.
        </p>

        {/* Form */}
        <Form
          ref={formRef}
          onSubmit={submitHandler}
          className="flex flex-col gap-6"
          method="post"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-800 font-medium text-sm sm:text-base mb-2 tracking-wide"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue="eyuealayalew191@gmail.com"
              placeholder="you@example.com"
              required
              className="
                w-full px-4 py-3 sm:py-3.5 md:py-4
                border border-gray-300 rounded-lg
                bg-gray-50 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-blue-500 transition duration-200 ease-in-out
                text-sm sm:text-base
              "
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-gray-800 font-medium text-sm sm:text-base mb-2 tracking-wide"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={isPasswordShown ? "text" : "password"}
              defaultValue="090904Eyueal***"
              placeholder="••••••••"
              required
              className="
                w-full px-4 py-3 sm:py-3.5 md:py-4 pr-12
                border border-gray-300 rounded-lg
                bg-gray-50 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-blue-500 transition duration-200 ease-in-out
                text-sm sm:text-base
              "
            />
            <button
              type="button"
              onClick={() => setIsPasswordShown((prev) => !prev)}
              className="absolute right-4 top-10 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={isPasswordShown ? "Hide password" : "Show password"}
            >
              {isPasswordShown ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 sm:py-3.5 md:py-4 rounded-lg font-semibold text-white
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
              shadow-md hover:shadow-lg
              transform hover:scale-105 active:scale-95
              transition-all duration-200 ease-in-out
              text-base sm:text-lg md:text-xl
            `}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LogIn;
