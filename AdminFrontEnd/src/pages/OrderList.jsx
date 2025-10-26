import React, { useState, useEffect } from "react";
import Axios from "../axios/axios.config.js";
import { toast } from "react-toastify";
import OrderCard from "../components/OrderCard.jsx";

function OrderList() {
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [update, setUpdate] = useState(false);

  // Fetch all orders (admin or filtered by email)
  const getOrdersList = async () => {
    setOrderLoading(true);
    try {
      const email = localStorage.getItem("email"); // send email as query param
      const res = await Axios.get("/api/order/", {
        params: { email },
        headers: { "Content-Type": "application/json" },
      });
      const data = res.data;
      if (data.success) {
        setOrderList(data.orders);
      } else {
        setOrderList([]);
        toast.error(data.message || "No orders found");
      }
    } catch (error) {
      console.error("Fetch orders error:", error.response || error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setOrderList([]);
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    getOrdersList();
  }, [update]);

  if (orderLoading) {
    return (
      <div className="font-semibold text-xl text-center py-6 text-gray-700">
        Loading orders...
      </div>
    );
  }
if(!orderList.length) return   <div className="font-semibold text-xl text-center py-6 text-gray-700">
        No Orders...
      </div>
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 lg:p-10">
      {orderList.length ? (
        orderList.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            setUpdate={setUpdate}
            className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all p-6"
          />
        ))
      ) : (
        <div className="text-gray-600 text-center py-4">
          No orders found.
        </div>
      )}
    </div>
  );
}

export default OrderList;
