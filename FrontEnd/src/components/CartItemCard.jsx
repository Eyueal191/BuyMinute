import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Axios from "../axios/axios.config.js";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserCart } from "../redux/cartSlice.js";

function CartItemCard({ item, setRefetchCart }) {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!item || !item.product) return null; // safety check

  const removeHandler = async () => {
    try {
      setIsDeleting(true);
      const response = await Axios.delete(`/api/cart/${userId}/item`, {
        data: item,
      });
      const data = response.data;

      if (data.success && data.userCart) {
        setRefetchCart((prev) => !prev);
        dispatch(
          setUserCart({
            ...data.userCart,
            items: [...data.userCart.items],
          })
        );
        toast.success("Item removed from cart");
      } else {
        toast.error("Failed to update cart");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`w-full flex flex-wrap sm:flex-nowrap items-center gap-6 p-5 border border-gray-200 rounded-2xl shadow-md bg-white
        hover:bg-gray-50 hover:shadow-lg transition-all duration-300 ${
          isDeleting ? "opacity-50 pointer-events-none" : ""
        }`}
    >
      {/* Product Image */}
      <figure className="w-32 h-32 flex-shrink-0 relative rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
        )}
        <img
          src={item.product.images?.[0] || "/placeholder.png"}
          alt={item.product.name || "Product Image"}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover rounded-xl transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </figure>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-center gap-2 min-w-[180px]">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
          {item.product.name || "Unknown Product"}
        </h1>
        <h2 className="text-sm sm:text-base font-semibold text-gray-700">
          Price:{" "}
          <span className="text-indigo-600 font-bold">
            ${item.product.price?.toFixed(2) || "0.00"}
          </span>
        </h2>
        <h3 className="text-sm sm:text-base font-semibold text-gray-700">
          Quantity:{" "}
          <span className="text-indigo-600 font-bold">{item.quantity || 0}</span>
        </h3>
      </div>

      {/* Delete Button */}
      <button
        className="flex items-center gap-2 text-red-600 border border-red-600 rounded-lg px-5 py-2 hover:text-red-800 hover:bg-red-50 ring-1 ring-red-400 font-semibold transition-all duration-200 sm:ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={removeHandler}
        disabled={isDeleting}
      >
        <RiDeleteBin6Line size={22} />
        <span>Remove</span>
      </button>
    </div>
  );
}

export default CartItemCard;
