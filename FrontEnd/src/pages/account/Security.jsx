import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Axios from "../../axios/axios.config.js"; // your own Axios import
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

      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password must match.");
        setLoading(false);
        return;
      }
      const res = await Axios.post(`/api/user/reset-password/${userId}`, {
        password: newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password changed successfully!");
        e.target.reset(); // clear form
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={saveChange}
        className="flex flex-col gap-4 p-6 bg-white shadow-lg rounded-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Change Password
        </h2>

        {/* New Password */}
        <label htmlFor="new-password" className="flex flex-col gap-1">
          New Password:
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="new-password"
              id="new-password"
              className="border p-2 rounded w-full pr-10 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </label>

        {/* Confirm Password */}
        <label htmlFor="confirm-password" className="flex flex-col gap-1">
          Confirm Password:
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm-password"
              id="confirm-password"
              className="border p-2 rounded w-full pr-10 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="text-lg bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] mx-auto"
        >
          {loading ? "Saving..." : "Save Change"}
        </button>
      </form>
    </div>
  );
}

export default Security;
