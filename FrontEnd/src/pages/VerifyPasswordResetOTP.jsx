import React, { useState, useEffect } from "react";
import {
  useSearchParams,
  Form,
  useActionData,
  useNavigate,
} from "react-router-dom";
import Axios from "../axios/axios.config.js";
import toast from "react-hot-toast";

function VerifyPasswordResetOTP() {
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
        setTimeout(() => navigate("/password-reset"), 1000);
      } else {
        toast.error(data.message);
      }
    }
  }, [data, navigate]);

  const changeHandler = (e) => setOtp(e.target.value);

  const resendHandler = async () => {
    try {
      const payload = JSON.stringify({ email });
      const response = await Axios.post(
        "/api/user/resend-password-otp",
        payload
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Resend OTP failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 bg-gray-50">
      <Form
        method="post"
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Verify Your OTP
        </h2>

        <p className="text-sm text-gray-500 text-center">
          Enter the OTP sent to <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          name="otp"
          value={otp}
          onChange={changeHandler}
          placeholder="Enter OTP"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400"
        />

        <input type="hidden" name="email" value={email} />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 rounded-lg transition-all hover:bg-gray-900"
          >
            Submit OTP
          </button>

          <button
            type="button"
            onClick={resendHandler}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-all"
          >
            Resend OTP
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-2">
          Didn't receive the OTP? Click resend to get a new one.
        </p>
      </Form>
    </div>
  );
}

export default VerifyPasswordResetOTP;
