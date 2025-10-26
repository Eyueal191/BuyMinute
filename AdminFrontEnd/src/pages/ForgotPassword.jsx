import React, { useRef, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import Axios from "../axios/axios.config";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");

    if (loading) return;
    try {
      setLoading(true);
      const response = await Axios.post("/api/user/forgot-password", { email });
      const data = response.data;

      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("email", email)
        formRef.current.reset();
        setTimeout(() => {
          navigate(`/verify-password-otp?code=${data.code}`);
        }, 2000);
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-xl border border-gray-100">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-4 leading-tight">
          Reset Your Password
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm sm:text-base md:text-lg text-center mb-8 leading-relaxed">
          Enter your registered email address and we’ll send you a link to reset your password.
        </p>

        {/* Form */}
        <Form
          ref={formRef}
          onSubmit={submitHandler}
          className="space-y-6"
          method="post"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-gray-800 font-medium text-sm sm:text-base mb-2 tracking-wide"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                className="
                  w-full pl-10 pr-4 py-3 sm:py-3.5
                  border border-gray-300 rounded-md
                  bg-gray-50 placeholder-gray-400
                  text-sm sm:text-base
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500 transition duration-200
                "
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 sm:py-3.5 rounded-md font-semibold text-white 
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
              shadow-md hover:shadow-lg
              transform hover:scale-105 active:scale-95
              transition-all duration-200 ease-in-out text-sm sm:text-base md:text-lg
            `}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
