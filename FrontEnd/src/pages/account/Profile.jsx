import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Axios from "../../axios/axios.config.js";
import { Form } from "react-router-dom";
import Loading from "../../components/Loading.jsx";

function Profile() {
  const [viewMode, setViewMode] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  // Fetch user data
  const getUser = async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get(`/api/user/${userId}`);
      if (data.success) setUser(data.user);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // Update user data
  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData(e.target);
      const userData = {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        bio: form.get("bio"),
      };
      ["name", "email", "phone", "bio"].forEach((f) => form.delete(f));
      form.append("data", JSON.stringify(userData));

      const { data } = await Axios.put(`/api/user/${userId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");
        getUser();
        setViewMode(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  if (loading) return <Loading />;

  return (
    <div className="w-full p-6 max-w-5xl mx-auto space-y-10">
      {viewMode ? (
        // VIEW MODE
        <div className="flex flex-col gap-6 border p-6 rounded-xl shadow-md bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <img
              src={user?.profileImage || "https://via.placeholder.com/120"}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow"
            />
            <div className="flex flex-col sm:ml-4 gap-2 text-center sm:text-left flex-1">
              <span className="font-semibold text-lg text-gray-800">
                {user?.name || "N/A"}
              </span>
              <span className="text-gray-600">{user?.email || "N/A"}</span>
              <span className="text-gray-600">
                {user?.phone || "Not registered"}
              </span>
            </div>
            <button
              onClick={() => setViewMode(false)}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          </div>
          <div className="pt-4 border-t">
            <h3 className="text-gray-700 font-semibold mb-1 text-sm sm:text-base">
              Bio
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {user?.bio || "No bio available."}
            </p>
          </div>
        </div>
      ) : (
        // EDIT MODE
        <Form
          method="post"
          onSubmit={updateUser}
          className="flex flex-col gap-6 sm:flex-row sm:items-start border p-6 rounded-xl shadow-md bg-white"
        >
          <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
            <img
              src={user?.profileImage || "https://via.placeholder.com/120"}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow"
            />
            <label className="mt-4 w-48">
              <span className="block text-gray-700 text-sm font-medium mb-1">
                Profile Picture
              </span>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer border rounded-md p-1 focus:ring-2 focus:ring-blue-300 transition"
                title="Choose a profile picture"
              />
              <p className="text-xs text-gray-500 mt-1 italic">
                (No file chosen yet)
              </p>
            </label>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <label className="flex flex-col">
              <span className="text-sm text-gray-700 font-medium">Name</span>
              <input
                type="text"
                name="name"
                defaultValue={user?.name}
                className="border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 font-medium">Email</span>
              <input
                type="email"
                name="email"
                defaultValue={user?.email}
                className="border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 font-medium">Phone</span>
              <input
                type="text"
                name="phone"
                defaultValue={user?.phone}
                className="border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-300"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700 font-medium">Bio</span>
              <textarea
                name="bio"
                defaultValue={user?.bio}
                className="border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-300 resize-none h-24 text-sm"
              />
            </label>

            <div className="flex flex-wrap gap-4 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setViewMode(true)}
                className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}
export default Profile;
