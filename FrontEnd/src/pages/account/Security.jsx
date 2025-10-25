import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Axios from "../../axios/axios.config.js";

function Security() {
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const userId = localStorage.getItem("userId");

  const saveChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const newPassword = formData.get("new-password");
      const confirmPassword = formData.get("confirm-password");
      const email=localStorage.getItem("email");
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password must match.");
        setLoading(false);
        return;
      }
 const payLoad = {
            email,
            password:newPassword
        }
        const res = await Axios.post("/api/user/reset-password", payLoad, {
            headers: {
                "Content-Type": "application/json"
            }
        })
      if (res.data.success) {
        toast.success(res.data.message || "Password changed successfully!");
        e.target.reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-20 min-h-screen bg-gray-100">
      <form
        onSubmit={saveChange}
        className="flex flex-col gap-6 p-10 bg-white rounded-2xl shadow-xl w-full max-w-md transition-all"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-left border-b pb-3">
          Change Password
        </h2>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="new-password"
            className="text-gray-700 font-medium tracking-wide"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="new-password"
              id="new-password"
              placeholder="Enter new password"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition"
              aria-label="Toggle new password visibility"
            >
              {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirm-password"
            className="text-gray-700 font-medium tracking-wide"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm-password"
              id="confirm-password"
              placeholder="Confirm new password"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
export default Security;
