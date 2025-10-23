import React from "react";
import Axios from "../axios/axios.config.js";
import toast from "react-hot-toast";

function OrderCard({ item, setRefresh }) {
  if (!item?.product) return null;

  const { product, quantity, createdAt, paymentStatus } = item;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "Unknown date";

  const cancelHandler = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!item._id) {
        toast.error("Item ID not found");
        return;
      }
      const res = await Axios.delete(`/api/order/user/${userId}`, {
        data: { cancelItem: { _id: item._id } },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Item cancelled successfully");
        setRefresh((prev) => !prev);
      } else {
        toast.error(res.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling item:", error);
      toast.error(error.response?.data?.message || "Failed to cancel item");
    }
  };

  const paymentBadgeClasses =
    paymentStatus === "succeeded"
      ? "bg-green-100 text-green-700"
      : paymentStatus === "failed"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  const paymentText =
    paymentStatus === "succeeded"
      ? "Paid"
      : paymentStatus === "failed"
      ? "Failed"
      : "Pending";

  return (
    <div className="w-[90%] mx-auto flex flex-wrap sm:flex-nowrap items-center gap-6 p-4 border rounded-2xl shadow-md bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-lg">
      {/* Product Image */}
      <figure className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name || "Product"}
          loading="lazy"
          className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
        />
      </figure>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-center gap-1 min-w-[150px]">
        <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
          {product.name || "Unknown Product"}
        </h1>
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">
          Price: <span className="text-indigo-600">${product.price?.toFixed(2) || "0.00"}</span>
        </h2>
        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
          Quantity: <span className="text-indigo-600">{quantity || 0}</span>
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Ordered on: {formattedDate}
        </p>
      </div>

      {/* Payment Status + Actions */}
      <div className="flex flex-col items-center sm:items-end gap-2">
        <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
          <span>Payment Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${paymentBadgeClasses} shadow-sm`}
          >
            {paymentText}
          </span>
        </div>

        {/* Cancel Action */}
        <button
          onClick={cancelHandler}
          className="text-sm sm:text-base text-red-600 font-semibold hover:text-red-800 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
