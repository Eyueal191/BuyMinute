import React, { useState } from "react";
import Axios from "../axios/axios.config.js";
import { toast } from "react-toastify";

function OrderItemCard({ item, user, setUpdate }) {
  const [itemUpdate, setItemUpdate] = useState({
    paymentStatus: item.paymentStatus,
    status: item.status,
  });
  const [updating, setUpdating] = useState(false);

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setItemUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const submitUpdate = async () => {
    try {
      if (updating) return;
      setUpdating(true);

      const response = await Axios.put(`/api/order/${item._id}`, {
        itemUpdate,
        userId: user._id,
      });

      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        setUpdate((prev) => !prev); // trigger parent refresh
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating order item:", error);
      toast.error("Something went wrong while updating");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md hover:border-gray-300 transition-all duration-300 ease-in-out">
      {/* Product Image */}
      <figure className="w-28 h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 hover:shadow-md transition-shadow duration-200">
        <img
          src={item?.product?.images?.[0] || "/placeholder.png"}
          alt={item?.product?.name || "Product"}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </figure>

      {/* Product Details */}
      <div className="flex-1 space-y-2">
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
          {item?.product?.name || "Product Name"}
        </h1>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-800">Price:</span>{" "}
          <span className="text-blue-600">${item?.product?.price ?? "N/A"}</span>
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-800">Order Date:</span>{" "}
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-800">Ordered by:</span>{" "}
          <span className="text-gray-900">{user?.name}</span>
        </p>
      </div>

      {/* Status Controls */}
      <div className="flex flex-row items-end md:items-center gap-5 flex-wrap md:flex-nowrap">
        {/* Payment Status */}
        <div className="flex flex-col min-w-[150px]">
          <label className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
            Payment Status
          </label>
          <select
            name="paymentStatus"
            value={itemUpdate.paymentStatus}
            onChange={handleUpdate}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          >
            {["pending", "succeeded", "failed"].map((ps) => (
              <option value={ps} key={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>

        {/* Order Status */}
        <div className="flex flex-col min-w-[150px]">
          <label className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
            Order Status
          </label>
          <select
            name="status"
            value={itemUpdate.status}
            onChange={handleUpdate}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          >
            {["processing", "shipped", "delivered", "cancelled"].map((s) => (
              <option value={s} key={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Update Button */}
        <div className="flex-shrink-0">
          <button
            onClick={submitUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-6 py-2 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 mt-4 md:mt-0"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderItemCard;
