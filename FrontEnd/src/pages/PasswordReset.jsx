import React, { useState, useEffect, useRef } from "react";
import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
function PasswordReset() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isCPasswordShown, setIsCPasswordShown] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const data = useActionData();
  // Handle response from action
  useEffect(() => {
    if (data) {
      if (data.success) {
        formRef.current.reset();
        toast.success(data.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(data.message);
      }
    }
  }, [data, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
          Reset Your Password
        </h2>

        <Form method="post" ref={formRef} className="flex flex-col gap-4">
          <label className="flex flex-col text-gray-700 text-sm sm:text-base">
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 p-3 sm:p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </label>

          <label className="flex flex-col text-gray-700 text-sm sm:text-base relative">
            Password
            <input
              type={isPasswordShown ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="mt-1 p-3 sm:p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
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
              className="mt-1 p-3 sm:p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              onClick={() => setIsCPasswordShown((prev) => !prev)}
            >
              {isCPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 sm:py-4 rounded-lg hover:bg-gray-900 transition-transform mt-2"
          >
            Reset
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
