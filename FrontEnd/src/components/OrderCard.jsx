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
      const res = await Axios.delete(`/api/order/${userId}/item`, {
        data: { cancelItem: item },
      });

      const data = res.data;
      if (data.success) {
        toast.success(data.message || "Item cancelled successfully");
        setRefresh((prev) => !prev); // triggers parent re-fetch
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling item:", error);
      toast.error(error.response?.data?.message || "Failed to cancel item");
    }
  };

  return (
    <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-6 p-4 border rounded-xl shadow-sm transition duration-300 bg-white hover:bg-gray-50">
      {/* Product Image */}
      <figure className="w-28 h-28 flex-shrink-0 relative rounded-xl overflow-hidden">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name || "Product"}
          loading="lazy"
          className="w-full h-full object-cover rounded-xl transition-opacity duration-500"
        />
      </figure>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-center gap-1">
        <h1 className="text-base sm:text-lg font-bold text-gray-900">
          {product.name || "Unknown Product"}
        </h1>
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">
          Price:{" "}
          <span className="text-indigo-600">
            ${product.price?.toFixed(2) || "0.00"}
          </span>
        </h2>
        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
          Quantity:{" "}
          <span className="text-indigo-600">{quantity || 0}</span>
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
            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
              paymentStatus === "succeeded"
                ? "bg-green-100 text-green-700"
                : paymentStatus === "failed"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {paymentStatus === "succeeded"
              ? "Paid"
              : paymentStatus === "failed"
              ? "Failed"
              : "Pending"}
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
