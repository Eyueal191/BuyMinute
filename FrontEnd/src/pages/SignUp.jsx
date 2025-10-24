import React, { useState, useEffect, useRef } from "react";
import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
function SignUp() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isCPasswordShown, setIsCPasswordShown] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const data = useActionData(); // Get action data for success/error response
  // Handle response from action data
  useEffect(() => {
    if (data) {
      switch (data.success) {
        case true:    
          formRef.current.reset();
          toast.success(data.message);
          setTimeout(() => {
            navigate("/verify-email-otp");
          }, 1000);
          break;
        case false:
          toast.error(data.message);
          break;
        default:
          null;
      }
    }
  }, [data]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8 bg-gray-50 py-12">
      <div className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl 2xl:max-w-2xl bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
          Create Account
        </h2>
        <p className="text-gray-500 text-sm sm:text-base md:text-base text-center mb-6">
          Sign up to get started with MyStore
        </p>

        {/* Form */}
        <Form className="flex flex-col gap-4" method="post" ref={formRef}>
          <label className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base">
            Name
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="mt-1 p-3 sm:p-4 md:p-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base">
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 p-3 sm:p-4 md:p-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base relative w-full">
            Password
            <input
              type={isPasswordShown ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="mt-1 p-3 sm:p-4 md:p-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-[50px]  right-3 -translate-y-1/2 text-gray-500"
              onClick={() => setIsPasswordShown((prev) => !prev)}
            >
              {isPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          <label className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base relative w-full">
            Confirm Password
            <input
              type={isCPasswordShown ? "text" : "password"}
              name="cpassword"
              placeholder="Confirm your password"
              className="mt-1 p-3 sm:p-4 md:p-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-[50px] right-3 -translate-y-1/2 text-gray-500"
              onClick={() => setIsCPasswordShown((prev) => !prev)}
            >
              {isCPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 sm:py-4 md:py-4 rounded-md hover:scale-105 transition-transform mt-2"
          >
            Sign Up
          </button>

          <p className="text-gray-500 text-sm sm:text-base md:text-base text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
