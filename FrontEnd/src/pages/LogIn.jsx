import React, { useState, useRef } from "react";
import { Form, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Axios from "../axios/axios.config.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function LogIn() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await Axios.post("/api/user/login", payload);
      const data = response.data;
      if (data.success) {
        toast.success(data.message || "Login successful!");
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", data.email);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("loggedIn", true);
        console.log("AccessToken:", data.accessToken)
        navigate("/cart")

      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8 bg-gray-50">
      <div className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl 2xl:max-w-2xl bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
          Log In
        </h2>
        <p className="text-gray-500 text-sm sm:text-base text-center mb-6">
          Enter your credentials to access your account
        </p>

        <Form method="post" ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="email" className="flex flex-col text-gray-700 text-sm sm:text-base">
            Email
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <label htmlFor="password" className="flex flex-col text-gray-700 text-sm sm:text-base relative">
            Password
            <input
              id="password"
              type={isPasswordShown ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="mt-1 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              onClick={() => setIsPasswordShown(prev => !prev)}
            >
              {isPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:scale-105 transition-transform mt-2"
          >
            Log In
          </button>

          <Link to="/forgotpassword" className="text-blue-600 hover:underline text-center w-full">
            Forgot Password?
          </Link>

          <p className="text-gray-500 text-sm sm:text-base text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
export default LogIn;
