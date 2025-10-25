import React, { useState, useRef } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Axios from "../axios/axios.config.js";
import { toast } from "react-toastify";

function LogIn() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const email = formData.get("email")?.trim();
    const password = formData.get("password")?.trim();

    if (!email || !password) {
      toast.error("Email and password must be filled");
      return;
    }

    try {
      const payload = { email, password };
      const response = await Axios.post("/api/user/login", payload);
      const data = response.data;

      if (data.success) {
        // Store admin info in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", data.userEmail);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("loggedIn", true);

        toast.success(data.message || "Logged in successfully");
        formRef.current.reset();
        navigate("/"); // Redirect to dashboard or admin panel
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl 2xl:max-w-2xl bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg border border-gray-200">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 text-center mb-2">
          Admin Log In
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-base text-center mb-6">
          Enter your admin credentials to access the dashboard
        </p>

        {/* Form */}
        <Form ref={formRef} onSubmit={submitHandler} className="flex flex-col gap-5">
          {/* Email */}
          <label htmlFor="email" className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base">
            Email
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 px-4 py-3 sm:py-4 md:py-4 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              required
            />
          </label>

          {/* Password */}
          <label htmlFor="password" className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base relative">
            Password
            <input
              id="password"
              name="password"
              type={isPasswordShown ? "text" : "password"}
              placeholder="Enter your password"
              className="mt-1 px-4 py-3 sm:py-4 md:py-4 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordShown((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 sm:py-4 md:py-4 rounded-md hover:bg-blue-700 hover:scale-105 active:scale-95 transition-transform shadow-md"
          >
            Log In
          </button>

          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-800 hover:underline text-center w-full mt-2"
          >
            Forgot Password?
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default LogIn;
