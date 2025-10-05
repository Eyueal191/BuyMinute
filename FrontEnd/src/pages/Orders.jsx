import React, { useEffect, useRef, useState } from "react";
import Axios from "../axios/axios.config.js";
import toast from "react-hot-toast";
import { useVirtualizer } from "@tanstack/react-virtual";
import OrderCard from "../components/OrderCard.jsx";
import Title from "../components/Title.jsx";

function Orders() {
  const [userOrders, setUserOrders] = useState(null); // ✅ start with null, not {}
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const userId = localStorage.getItem("userId");
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: userOrders?.items?.length || 0,
    estimateSize: () => 170,
    overscan: 2,
    getScrollElement: () => parentRef.current,
  });

  const getUserOrders = async () => {
    try {
      setLoading(true);
      const res = await Axios.get(`/api/order/${userId}`);
      const data = res.data;

      if (data.success) {
        toast.success(data.message);
        setUserOrders(data.orders || null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get user orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserOrders();
    }
  }, [userId, refresh]); // ✅ re-fetch when refresh toggles

  useEffect(() => {
    if (userOrders) {
      console.log("userOrder:", userOrders.items?.[0]);
    }
  }, [userOrders]); // ✅ log updated orders

  return (
    <div className="min-h-screen w-full p-4 flex flex-col items-center gap-6 py-20">
      <h1 className="text-left self-start ml-[10vw]">
        <Title
          text1="You have ordered these"
          text2="List of orders"
          addSolidLineAfter={true}
        />
      </h1>

      <div
        ref={parentRef}
        className="relative overflow-auto h-screen w-[95%] sm:w-4/5 max-w-6xl mx-auto bg-white rounded-xl shadow-sm py-10"
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : !userOrders ? (
          <p className="text-center text-gray-500">No order found.</p>
        ) : (
          <div
            style={{
              position: "relative",
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = userOrders.items?.[virtualRow.index];
              if (!item) return null;

              return (
                <div
                  key={item._id || virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {/* ✅ fixed typo: setRefresh, not setRefersh */}
                  <OrderCard item={item} setRefresh={setRefresh} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default Orders;
