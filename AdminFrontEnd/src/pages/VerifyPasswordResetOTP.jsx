import React, { useState, useEffect, useContext, useRef } from "react";
import { useSearchParams, Form, useNavigate } from "react-router-dom";
import Axios from "../axios/axios.config.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

function VerifyPasswordResetOTP() {
  const { email } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const navigate = useNavigate();

  // Pre-fill OTP if code is present in query
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) setOtp(code);
  }, [searchParams]);

  const changeHandler = (e) => setOtp(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const payload = { email, otp };
      const { data } = await Axios.post("/api/user/verify-password-otp", payload);
      if (data.success) {
        formRef.current.reset();
        setOtp("");
        toast.success(data.message);
        setTimeout(() => navigate("/password-reset"), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const { data } = await Axios.post("/api/user/resend-password-otp", { email });
      if (data.success) {
        formRef.current.reset();
        setOtp("");
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Resend OTP failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 px-4 sm:px-6">
      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        method="post"
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6 border border-gray-100"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900">
          Verify Your OTP
        </h2>
        <p className="text-sm sm:text-base text-gray-500 text-center">
          Enter the OTP sent to <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          name="otp"
          value={otp}
          onChange={changeHandler}
          placeholder="Enter OTP"
          className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm placeholder-gray-400 transition"
        />

        <input type="hidden" name="email" value={email} />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit OTP
          </button>

          <button
            type="button"
            onClick={resendHandler}
            disabled={loading}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 sm:py-4 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend OTP
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-400 text-center mt-2">
          Didn't receive the OTP? Click resend to get a new one.
        </p>
      </Form>
    </div>
  );
}
export default VerifyPasswordResetOTP;
