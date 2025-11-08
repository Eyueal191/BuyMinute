import React, { useState, useRef } from "react";
import Axios from "../axios/axios.config.js";
import { Form, Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

function SignUp() {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isCPasswordShown, setIsCPasswordShown] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = formValues;

    if (password !== cpassword) {
      return toast.error("Password and confirm password must match");
    }

    try {
      const response = await Axios.post("/api/user/signup", { name, email, password });
      const data = response.data;

      if (data.success) {
        toast.success(data.message);
        formRef.current.reset();
        setFormValues({ name: "", email: "", password: "", cpassword: "" });
        setTimeout(() => navigate(`/verify-email-otp/${email}`), 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8 py-12">
      <div className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl 2xl:max-w-2xl bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
          Create Account
        </h2>
        <p className="text-gray-500 text-sm sm:text-base md:text-base text-center mb-6">
          Sign up to get started with MyStore
        </p>

        <Form className="flex flex-col gap-4" ref={formRef} onSubmit={submitHandler}>
          {/* Name */}
          <label className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base">
            Name
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 p-3 sm:p-4 md:p-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base">
            Email
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 p-3 sm:p-4 md:p-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Password */}
          <label className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base relative w-full">
            Password
            <input
              type={isPasswordShown ? "text" : "password"}
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 p-3 sm:p-4 md:p-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-[50px] right-3 -translate-y-1/2 text-gray-500"
              onClick={() => setIsPasswordShown((prev) => !prev)}
            >
              {isPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          {/* Confirm Password */}
          <label className="flex flex-col text-gray-700 text-sm sm:text-base md:text-base relative w-full">
            Confirm Password
            <input
              type={isCPasswordShown ? "text" : "password"}
              name="cpassword"
              value={formValues.cpassword}
              onChange={handleChange}
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

          {/* Submit */}
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
