import React, { useState} from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Axios from "../axios/axios.config.js";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserCart } from "../redux/cartSlice.js";
function CartItemCard({ item, setRefetchCart }) {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId")
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
        console.log(data.message)
      if (data.success && data.userCart) {
        // Update Redux with a new array reference to trigger re-render
        setRefetchCart((prev)=>!prev)
        dispatch(
          setUserCart({
            ...data.userCart,
            items: [...data.userCart.items],
          })
        )
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
      className={`w-full flex items-center gap-6 p-4 border rounded-xl shadow-sm transition-all duration-300 bg-white hover:bg-gray-50 ${
        isDeleting ? "opacity-50" : ""
      }`}
    >
      {/* Product Image */}
      <figure className="w-28 h-28 flex-shrink-0 relative rounded-xl overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
        )}
        <img
          src={item.product.images?.[0] || "/placeholder.png"}
          alt={item.product.name || "Product Image"}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </figure>
  {/* Product Details */}
      <div className="flex-1 flex flex-col justify-center gap-1">
        <h1 className="text-lg text-gray-900 font-bold">
          {item.product.name || "Unknown Product"}
        </h1>
        <h2 className="text-gray-800 font-semibold">
          Price: <span className="text-indigo-600">${item.product.price || 0}</span>
        </h2>
        <h3 className="text-gray-800 font-semibold">
          Quantity: <span className="text-indigo-600">{item.quantity || 0}</span>
        </h3>
      </div>
      {/* Delete Button */}
      <button
        className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={removeHandler}
        disabled={isDeleting}
      >
        <RiDeleteBin6Line size={24} />
        <span>Remove</span>
      </button>
    </div>
  );
}
export default CartItemCard;
