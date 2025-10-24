import React, { useEffect, useState, useRef, useContext } from "react";
import { Form, useNavigate } from "react-router-dom";
import Axios from "../axios/axios.config";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { Mail } from "lucide-react";

function ForgotPassword() {
  const { setEmail } = useContext(AuthContext);
  let navigate = useNavigate();
  let formRef = useRef();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let email = formData.get("email");
    let payload = { email };
    if (loading) return;
    try {
      setLoading(true);
      let response = await Axios.post("/api/user/forgot-password", payload);
      let data = response.data;
      if (data.success) {
        toast.success(data.message);
        formRef.current.reset();
        setEmail(email);
        setTimeout(() => {
          navigate(`/verify-password-otp?code=${data.code}`);
        }, 2000);
      } else {
        throw new Error(data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl 2xl:max-w-2xl bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-lg border border-gray-200">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold mb-4 text-center text-gray-900">
          Reset Your Password
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-base text-center mb-6">
          Enter your email and we’ll send you instructions to reset your password.
        </p>

        {/* Form */}
        <Form
          className="flex flex-col gap-5"
          method="post"
          onSubmit={submitHandler}
          ref={formRef}
        >
          <div className="flex flex-col relative">
            <label
              htmlFor="email"
              className="text-gray-700 font-medium text-sm sm:text-base mb-2 tracking-wide"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="
                  w-full px-10 py-3 sm:py-4 border border-gray-300
                  rounded-md bg-gray-50 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500 transition duration-200 ease-in-out
                "
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full bg-blue-600 text-white font-semibold
              py-3 sm:py-4 rounded-md shadow-md
              hover:bg-blue-700 hover:scale-105
              active:scale-95 transition-transform duration-200 ease-in-out
            "
          >
            Send Reset Link
          </button>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
