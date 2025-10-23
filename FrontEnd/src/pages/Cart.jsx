import React, { useRef, lazy, Suspense, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { RiDeleteBin6Line } from "react-icons/ri"; // Clear/Delete icon
import Title from "../components/Title.jsx";
import Axios from "../axios/axios.config.js";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUserCart } from "../redux/cartSlice.js";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";

// Lazy load CartItemCard
const CartItemCard = lazy(() => import("../components/CartItemCard"));

function Cart() {
  const cartItems = useSelector((state) => state.userCart.userCart.items || []);
  const dispatch = useDispatch();
  const [refetchCart, setRefetchCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clearingCart, setClearingCart] = useState(false);
  const navigate = useNavigate();
  const parentRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const rowCount = cartItems.length;
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    estimateSize: () => 170, // Adjust this based on your CartItemCard's approximate height
    overscan: 2,
    getScrollElement: () => parentRef.current,
  });

  const getUserCart = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`/api/cart/${userId}`);
      const data = response.data;
      if (data.success) {
        dispatch(setUserCart(data.userCart || { user: userId, items: [] }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch UserCart");
    } finally {
      setLoading(false);
    }
  };

  const clearUserCart = async () => {
    try {
      setClearingCart(true);
      const response = await Axios.delete(`/api/cart/${userId}/clear`);
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        getUserCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear UserCart");
    } finally {
      setClearingCart(false);
    }
  };

  const proceedToOrderHandler = () => {
    navigate("/place-order", { state: { totalPrice: total } });
  };

  useEffect(() => {
    getUserCart();
  }, [refetchCart, userId]);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const additionalPrice = item.sizeOption?.additionalPrice || 0;
    return acc + (price + additionalPrice) * (item.quantity || 1);
  }, 0);
  const deliveryFee = subtotal > 0 ? 10 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen w-full p-4 flex flex-col md:flex-row gap-6 py-20">
      {/* Cart Items */}
      <div
        ref={parentRef}
        className="px-6 relative overflow-auto h-screen w-full md:w-2/3 bg-white rounded-xl shadow-sm py-10"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 font-semibold text-base sm:text-lg lg:text-xl">
            Your cart is empty
          </div>
        ) : (
          <div style={{ position: "relative", height: `${rowVirtualizer.getTotalSize()}px` }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = cartItems[virtualRow.index];
              if (!item || !item.product) return null;

              return (
                <div
                  key={item._id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Suspense fallback={<div className="h-40 animate-pulse bg-gray-200 rounded-xl" />}>
                    <CartItemCard item={item} setRefetchCart={setRefetchCart} />
                  </Suspense>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 md:self-start border border-gray-50">
        {/* Clear Cart Button */}
        <button
          onClick={clearUserCart}
          disabled={clearingCart || cartItems.length === 0}
          className="mb-4 flex items-center justify-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-red-600 hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm sm:text-base disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          <RiDeleteBin6Line size={20} />
          <span>Clear Cart</span>
        </button>

        <Title text1="CART" text2="TOTAL" addSolidLineAfter={true} />

        <div className="flex justify-between items-center text-gray-700 border-b border-gray-200 py-2 text-sm sm:text-base">
          <span>Subtotal:</span>
          <span className="font-semibold text-indigo-600">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-700 border-b border-gray-200 py-2 text-sm sm:text-base">
          <span>Delivery Fee:</span>
          <span className="font-semibold text-indigo-600">${deliveryFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-900 font-bold border-b border-gray-200 py-2 text-base sm:text-lg">
          <span>Total:</span>
          <span className="text-indigo-600">${total.toFixed(2)}</span>
        </div>

        {/* Proceed to Order Button */}
        <button
          onClick={proceedToOrderHandler}
          disabled={cartItems.length === 0}
          className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          Proceed to Order
        </button>
      </div>
    </div>
  );
}
export default Cart;