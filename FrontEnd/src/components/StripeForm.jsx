import React, { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Axios from "../axios/axios.config.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function StripeForm({ orderItems }) {
  const [confirming, setConfirming] = useState(false);
  const userId = localStorage.getItem("userId");
  const elements = useElements();
  const stripe = useStripe();
  const navigate = useNavigate();

  const confirmPayment = async () => {
    if (!stripe || !elements) return; // Stripe.js not ready yet
    try {
      setConfirming(true);
      const { error, paymentIntent } = await stripe.confirmPayment({ elements });

      if (paymentIntent && paymentIntent.status === "succeeded") {
        const paymentUpdatedItems = orderItems.map((item) => {
          item.paymentStatus = "succeeded";
          return item;
        });

        const res = await Axios.put(`/api/order/${userId}`, {
          paymentUpdatedItems,
          oldItems: orderItems,
        });

        const data = res.data;
        if (data.success) {
          toast.success(data.message || "Payment successful");
          navigate("/orders");
        }
      }

      if (error) {
        toast.error(error.message || "Payment failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete payment");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-6">
      <PaymentElement className="w-full" />

      <button
        onClick={confirmPayment}
        disabled={confirming || !stripe || !elements}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {confirming ? "Confirming..." : "Confirm Payment"}
      </button>
    </div>
  );
}
export default StripeForm;
