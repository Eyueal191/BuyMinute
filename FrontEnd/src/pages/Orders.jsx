import React, { useEffect, useRef, useState, useCallback } from "react";
import Axios from "../axios/axios.config.js";
import toast from "react-hot-toast";
import { useVirtualizer } from "@tanstack/react-virtual";
import OrderCard from "../components/OrderCard.jsx";
import Title from "../components/Title.jsx";
import Loading from "../components/Loading.jsx";

function Orders() {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const userId = localStorage.getItem("userId");
  const parentRef = useRef();

  const fetchUserOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`/api/order/user/${userId}`);
      const data = response.data;
      if (data.success) setUserOrders(data.orders?.items || []);
      else setUserOrders([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
      setUserOrders([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchUserOrders();
  }, [fetchUserOrders, refresh]);

  // 🧠 Virtualizer setup (single column)
  const rowVirtualizer = useVirtualizer({
    count: userOrders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () =>180, // height estimate for each order card
    overscan: 3,
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-8 py-20 px-4 bg-gray-50">
      {/* 🧩 Title */}
      <div className="w-[95%] sm:w-4/5 max-w-6xl mx-auto text-left">
        <Title
          text1="My Orders"
          text2="Overview"
          text1Color="text-black"
          text2Color="text-blue-500"
          addSolidLineAfter={true}
          lineColor="bg-blue-500"
        />
      </div>

      {/* 🧾 Orders Container */}
      <div
        ref={parentRef}
        className="relative overflow-auto h-[150vh] w-[95%] sm:w-4/5 max-w-6xl bg-white rounded-xl shadow-md border border-gray-200 p-4"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        ) : userOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No orders found.</p>
        ) : (
          <div
            style={{
              position: "relative",
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = userOrders[virtualRow.index];
              return (
                <div
                  key={item?._id || virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="pb-4"
                >
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
