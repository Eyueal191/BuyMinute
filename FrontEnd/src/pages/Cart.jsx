import React, { useRef, lazy, Suspense, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Title from "../components/Title.jsx";
import Axios from "../axios/axios.config.js";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUserCart } from "../redux/cartSlice.js";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
// Lazy load CartItemCard;
const CartItemCard = lazy(() => import("../components/CartItemCard"));
function Cart() {
  //const [cartItems, setCartItems] = useState([]);
  const cartItems = useSelector((state) => state.userCart.userCart.items || []);
  const dispatch = useDispatch()
  const [refetchCart, setRefetchCart] = useState(false);
  const navigate = useNavigate();
  const parentRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const rowCount = cartItems.length;
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    estimateSize: () => 170,
    overscan: 2,
    getScrollElement: () => parentRef.current,
  });

  const getUserCart = async () => {
    try {
      const response = await Axios.get(`/api/cart/${userId}`);
      const data = response.data;

      if (data.success) {
       // setCartItems(data.userCart?.items || []);
        // Dispatch the cart to Redux
      dispatch(setUserCart(data.userCart || { user: userId, items: [] }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch UserCart");
    }
  };

  const clearUserCart = async () => {
    try {
      const response = await Axios.delete(`/api/cart/${userId}/clear`);
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        getUserCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear UserCart");
    }
  };
const proceedToOrderHandler = () => {
  navigate("/place-order", { state: { totalPrice: total } });
};
  useEffect(() => {
    getUserCart();
  }, [refetchCart, userId]);

  // Calculate subtotal and total dynamically
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
        className="relative overflow-auto h-screen w-full md:w-2/3 bg-white rounded-xl shadow-sm py-10"
      >
        <div
          style={{
            position: "relative",
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
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
                <Suspense
                  fallback={
                    <div className="h-40 animate-pulse bg-gray-200 rounded-xl" />
                  }
                >
                  <CartItemCard item={item} setRefetchCart={setRefetchCart} />
                </Suspense>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow-md flex flex-col gap-3 md:self-start border border-gray-50">
        
        {/* Clear Cart Button (above order summary) */}
        <button
          onClick={clearUserCart}
          className="mb-4 border p-4 bg-black text-white text-[18px] rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Clear My Cart Items
        </button>

        <Title text1="CART" text2="TOTAL" addSolidLineAfter={true} />

        <div className="flex justify-between text-gray-700 border-b border-gray-200 py-1">
          <span>Subtotal:</span>
          <span className="font-semibold text-indigo-600">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-700 border-b border-gray-200 py-1">
          <span>Delivery Fee:</span>
          <span className="font-semibold text-indigo-600">${deliveryFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-900 font-bold border-b border-gray-200 py-2">
          <span>Total:</span>
          <span className="text-indigo-600">${total.toFixed(2)}</span>
        </div>

        <button className="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200" onClick={proceedToOrderHandler}>
        Proceed to Order
        </button>
      </div>
    </div>
  );
}
export default Cart;
