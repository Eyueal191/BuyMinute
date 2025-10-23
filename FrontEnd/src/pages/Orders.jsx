import React, { useEffect, useRef, useState } from "react";
import Axios from "../axios/axios.config.js";
import toast from "react-hot-toast";
import { useVirtualizer } from "@tanstack/react-virtual";
import OrderCard from "../components/OrderCard.jsx";
import Title from "../components/Title.jsx";
import Loading from "../components/Loading.jsx";

function Orders() {
  const [userOrders, setUserOrders] = useState(null); // start with null
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const userId = localStorage.getItem("userId");
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: userOrders?.items?.length || 5, // show 5 skeletons if loading
    estimateSize: () => 170,
    overscan: 2,
    getScrollElement: () => parentRef.current,
  });

  const getUserOrders = async () => {
    try {
      setLoading(true);
      const res = await Axios.get(`/api/order/user/${userId}`);
      const data = res.data;
      if (data.success) {
        setUserOrders(data.orders || null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get user orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) getUserOrders();
  }, [userId, refresh]);

  return (
    <div className="min-h-screen w-full p-4 flex flex-col items-center gap-6 py-20 bg-gray-50">
      <h1 className="text-left self-start ml-[13vw]">
        <Title
          text1="List of Your Order's"
          text2="Details"
          addSolidLineAfter={true}
          lineColor="bg-gray-500"
        />
      </h1>

      <div
        ref={parentRef}
        className="relative overflow-auto h-screen w-[95%] sm:w-4/5 max-w-6xl mx-auto bg-white rounded-xl shadow-sm py-10"
      >
        {loading && !userOrders ? (
          // Full-page loader for initial fetch
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        ) : !userOrders || userOrders.items?.length === 0 ? (
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
                >
                  {loading && !item ? (
                    // Skeleton loader for virtualized items
                    <div className="h-40 w-full bg-gray-200 animate-pulse rounded-xl my-2" />
                  ) : (
                    <OrderCard item={item} setRefresh={setRefresh} />
                  )}
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
