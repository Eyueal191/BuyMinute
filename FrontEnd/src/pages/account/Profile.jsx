import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Axios from "../../axios/axios.config.js";
import { Form } from "react-router-dom";

function Profile() {
  const [viewMode, setViewMode] = useState(true);
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  // Fetch user data
  const getUser = async () => {
    try {
      const { data } = await Axios.get(`/api/user/${userId}`);
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user");
    }
  };

  // Update user data
  const updateUser = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData(e.target);

      // Collect text fields
      const userData = {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        bio: form.get("bio"),
      };

      // Remove them so only files remain
      ["name", "email", "phone", "bio"].forEach((field) => form.delete(field));

      // Append JSON data
      form.append("data", JSON.stringify(userData));

      // Send update request
      const { data } = await Axios.put(`/api/user/${userId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message || "User updated successfully");
        getUser();
        // update local state
        setViewMode(true);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while updating user"
      );
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  return (
    <div className="w-full p-6 space-y-10">
      {viewMode ? (
        // VIEW MODE
        <div className="flex flex-col gap-6 border p-6 rounded-xl shadow-md bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <img
              src={user?.profileImage || "https://via.placeholder.com/120"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div className="flex flex-col sm:ml-4 gap-1 text-center sm:text-left">
              <span className="font-semibold text-lg">Name: {user?.name || "N/A"}</span>
              <span className="text-gray-600">Email: {user?.email || "N/A"}</span>
              <span className="text-gray-600">
                Phone:{user?.phone || "Not registered"}
              </span>
            </div>
            <button
              onClick={() => setViewMode(false)}
              className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all"
            >
              Edit Profile
            </button>
          </div>
          <div className="pt-4 border-t">
            <h3 className="text-gray-700 font-semibold mb-1">Bio</h3>
            <p className="text-gray-600 leading-relaxed">{user?.bio || ""}</p>
          </div>
        </div>
      ) : (
        // EDIT MODE.
        <Form
          method="post"
          onSubmit={updateUser}
          className="flex flex-col gap-6 sm:flex-row sm:items-start border p-6 rounded-xl shadow-md bg-white"
        >
          <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
            <img
              src={user?.profileImage || "https://via.placeholder.com/120"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
          <input
  type="file"
  name="profileImage"
  accept="image/*"
  className="mt-2 border bg-gray-300 px-2 rounded-sm py-1 w-[12vw]"
/>
   </div> <div className="flex flex-col gap-4 w-full">
            <label className="flex flex-col">
              <span className="text-sm text-gray-700">Name:</span>
              <input
                type="text"
                name="name"
                defaultValue={user?.name}
                className="border rounded-lg p-2 mt-1"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700">Email:</span>
              <input
                type="email"
                name="email"
                defaultValue={user?.email}
                className="border rounded-lg p-2 mt-1"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700">Phone:</span>
              <input
                type="text"
                name="phone"
                defaultValue={user?.phone}
                className="border rounded-lg p-2 mt-1"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700">Bio:</span>
              <textarea
                name="bio"
                defaultValue={user?.bio}
                className="border rounded-lg p-2 mt-1"
              />
            </label>

            <div className="flex flex-wrap gap-4 mt-4">
              <button
                type="submit"
                className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setViewMode(true)}
                className="px-5 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500"
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
