import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Axios from "../axios/axios.config.js";
import Title from "../components/Title.jsx";
import { setUserCart } from "../redux/cartSlice.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeForm from "../components/StripeForm.jsx";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PlaceOrder() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const userCartItems = useSelector((state) => state.userCart.userCart.items);
  const navigate = useNavigate()
  const [hasBeenPlaced, setHasBeenPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Handle address input changes
  const addressHandler = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch user cart
  const getUserCart = async () => {
    try {
      setPlacing(true);
      const { data } = await Axios.get(`/api/cart/${userId}`);
      if (data.success) {
        dispatch(setUserCart(data.userCart || { user: userId, items: [] }));
        return data.userCart || { user: userId, items: [] };
      }
      return { user: userId, items: [] };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch UserCart");
      return { user: userId, items: [] };
    } finally {
      setPlacing(false);
    }
  };

  // Clear user cart
  const clearUserCart = async () => {
    try {
      const { data } = await Axios.delete(`/api/cart/${userId}/clear`);
      if (data.success) {
        toast.success(data.message);
        await getUserCart();
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear UserCart");
      return null;
    }
  };

  // Place order
  const placeOrder = async () => {
    if (placing) {
      return toast.error("Order is already being placed. Please wait...");
    }

    if (hasBeenPlaced) {
      return toast.error("Order has already been placed.");
    }

    const { street, city, state, postalCode, country, phone } = address;
    if (!street || !city || !state || !postalCode || !country || !phone) {
      return toast.error("Please fill all address fields");
    }

    if (!userCartItems.length) {
      setHasBeenPlaced(true);
      return toast.error("Your Cart is empty. Add some products to order.");
    }
    try {
      setPlacing(true);
      const orderItems = userCartItems.map((item) => ({
        product: item.product,
        quantity: Number(item.quantity) || 1,
        sizeOption: item.sizeOption || { size: null, additionalPrice: 0 },
        priceAtPurchase: Number(item.product.price),
        paymentMethod,
        address,
        status: "processing",
        paymentStatus: "pending",
      }));
      const res = await Axios.post(`/api/order/${userId}`, { orderItems: orderItems});
      const data = res.data;
      if (data.success) {
        setOrderItems(orderItems);
        setHasBeenPlaced(true);
        toast.success(data.message);

        await clearUserCart();
            
        if (paymentMethod === "card" && data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
        else {
          navigate("/orders")
        }
      }
    } catch (error) {
      console.error("Place order error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const totalPrice = (userCartItems || []).reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="w-full flex flex-col sm:flex-row gap-6 p-6 lg:p-20">
      {clientSecret ? (
        <div className="w-full sm:w-1/2 flex flex-col gap-4 border border-gray-300 p-6 rounded-lg">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeForm orderItems={orderItems} />
          </Elements>
        </div>
      ) : (
        <div className="w-full sm:w-1/2 flex flex-col gap-4 border border-gray-300 p-6 rounded-lg">
          <Title text1="Delivery" text2="Address" addSolidLineAfter />
          <div className="flex gap-2 w-full">
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={addressHandler}
              placeholder="Country"
              className="flex-1 border border-gray-400 px-3 py-2 rounded-lg focus:border-blue-500 outline-none transition-colors"
            />
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={addressHandler}
              placeholder="State"
              className="flex-1 border border-gray-400 px-3 py-2 rounded-lg focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2 w-full">
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={addressHandler}
              placeholder="City"
              className="flex-1 border border-gray-400 px-3 py-2 rounded-lg focus:border-blue-500 outline-none transition-colors"
            />
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={addressHandler}
              placeholder="Street"
              className="flex-1 border border-gray-400 px-3 py-2 rounded-lg focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <input
            type="text"
            name="postalCode"
            value={address.postalCode}
            onChange={addressHandler}
            placeholder="Postal Code"
            className="w-full border border-gray-400 px-3 py-2 rounded-lg focus:border-blue-500 outline-none transition-colors"
          />
          <input
            type="text"
            name="phone"
            value={address.phone}
            onChange={addressHandler}
            placeholder="Phone"
            className="w-full border border-gray-400 px-3 py-2 rounded-lg focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      )}

      <div className="w-full sm:w-1/2 flex flex-col gap-4 border border-gray-300 p-6 rounded-lg">
        <h1 className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</h1>

        <Title text1="Choose" text2="Payment Method" addSolidLineAfter />

        <div className="flex gap-4">
          <button
            className={`flex-1 py-3 font-semibold rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              paymentMethod === "cod"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setPaymentMethod("cod")}
          >
            Cash on Delivery
          </button>

          <button
            className={`flex-1 py-3 font-semibold rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              paymentMethod === "card"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            Pay with Card
          </button>
        </div>

        <button
          className="mt-4 text-[28px] py-2 px-3 font-bold rounded-xl transition-colors duration-300 shadow-md bg-black hover:bg-blue-600 hover:border hover:border-black text-white hover:brightness-110"
          onClick={placeOrder}
        >
          {placing ? "Placing..." : hasBeenPlaced ? "Placed" : "Place Order"}
        </button>
      </div>
    </div>
  );
}
export default PlaceOrder;
