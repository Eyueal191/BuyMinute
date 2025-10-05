import React, { useState, useEffect } from "react";
import {
  useSearchParams,
  Form,
  useActionData,
  useNavigate,
} from "react-router-dom";
import Axios from "../axios/axios.config.js";
import toast from "react-hot-toast";

function VerifyEmailOTP() {
  const  email  = localStorage.getItem("email");
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState("");
  const data = useActionData();
  const navigate = useNavigate();

  // Pre-fill OTP from query param
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) setOtp(code);
  }, [searchParams]);

  // Show toast on response
  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(data.message);
      }
    }
  }, [data, navigate]);

  const changeHandler = (e) => setOtp(e.target.value);

  const resendHandler = async () => {
    try {
      const payload = JSON.stringify({ email });
      const response = await Axios.post("/api/user/resend-email-otp", payload);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Resend failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Form className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Verify Your Email
        </h1>

        <p className="text-sm text-gray-500 text-center">
          We have sent a verification code to{" "}
          <span className="font-medium">{email}</span>.
        </p>

        <input
          type="text"
          name="otp"
          value={otp}
          onChange={changeHandler}
          placeholder="Enter OTP"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />

        <input type="hidden" name="email" value={email} />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="bg-black text-white font-medium px-4 py-2 rounded-md transition"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={resendHandler}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md transition"
          >
            Resend OTP
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-2">
          Didn't receive the code? Click resend to get a new one.
        </p>
      </Form>
    </div>
  );
}

export default VerifyEmailOTP;
