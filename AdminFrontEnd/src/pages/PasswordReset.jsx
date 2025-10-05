import React, { useState, useEffect, useRef } from "react";
import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Axios from "../axios/axios.config";
import { toast } from "react-toastify";

function PasswordReset() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isCPasswordShown, setIsCPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const data = useActionData();

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center">
          Reset Your Password
        </h2>

        <Form method="post" ref={formRef} className="flex flex-col gap-4" onSubmit={submitHandler}>
          <label className="flex flex-col text-gray-700 text-sm sm:text-base">
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 p-3 sm:p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </label>

          <label className="flex flex-col text-gray-700 text-sm sm:text-base relative">
           New Password
            <input
              type={isPasswordShown ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="mt-1 p-3 sm:p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
            <button
              type="button"
              className="absolute top-[7.5vh] right-[1vw] -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
              className="mt-1 p-3 sm:p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
            <button
              type="button"
              className="absolute top-[7.5vh] right-[1vw] -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsCPasswordShown((prev) => !prev)}
            >
              {isCPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 sm:py-4 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 mt-2"
          > Reset
          </button>
          <p className="text-gray-500 text-sm sm:text-base text-center mt-4">
            Remember your password?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Log in
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default PasswordReset;
