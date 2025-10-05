import React, { useState } from "react";
import Axios from "../axios/axios.config.js";
import { toast } from "react-toastify";
// OrderItemCard...
function OrderItemCard({ item, user, setUpdate }) {
  const [itemUpdate, setItemUpdate] = useState({
    paymentStatus: item.paymentStatus,
    status: item.status,
  });
  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setItemUpdate((prev) => ({ ...prev, [name]: value }));
  };
  const submitUpdate = async () => {
    try {
      const response = await Axios.put(`/api/order/item/${item._id}`, {itemUpdate, userId:user._id});
      let data = response.data;
      if (data.success) {
        toast.success(data.message);
        setUpdate((prev) => !prev); // trigger parent refresh
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating order item:", error);
      toast.error("Something went wrong while updating");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border border-gray-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition-all">
      {/* Product - Image */}
      <figure className="w-28 h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
        <img
          src={item?.product?.images?.[0] || "/placeholder.png"}
          alt={item?.product?.name || "Product"}
          className="object-cover w-full h-full"
        />
      </figure>
      {/* Product & Order Details */}
      <div className="flex-1 space-y-1">
        <h1 className="text-lg font-semibold text-gray-900">{item?.product?.name || "Product Name"}</h1>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-800">Price:</span> ${item?.product?.price ?? "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-800">Order Date:</span> {new Date(item.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-800">Ordered by:</span> {user?.name}
        </p>
      </div>
      {/* Status Controls */}
      <div className="flex flex-row items-end md:items-center gap-4 flex-wrap md:flex-nowrap">
        {/* Payment Status */}
        <div className="flex flex-col min-w-[150px]">
          <label className="text-xs font-medium text-gray-600 mb-1">Payment Status</label>
          <select
            name="paymentStatus"
            value={itemUpdate.paymentStatus}
            onChange={handleUpdate}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {["pending", "succeeded", "failed"].map((ps) => (
              <option value={ps} key={ps}>{ps}</option>
            ))}
          </select>
        </div>
        {/* Order Status */}
        <div className="flex flex-col min-w-[150px]">
          <label className="text-xs font-medium text-gray-600 mb-1">Order Status</label>
          <select
            name="status"
            value={itemUpdate.status}
            onChange={handleUpdate}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {["processing", "shipped", "delivered", "cancelled"].map((s) => (
              <option value={s} key={s}>{s}</option>
            ))}
          </select>
        </div>
        {/* Update Button */}
        <div className="flex-shrink-0">
          <button
            onClick={submitUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-5 py-2 shadow-sm transition mt-4"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
export default OrderItemCard;
