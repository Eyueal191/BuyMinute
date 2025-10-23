import React, { useState, useEffect } from "react";
import Axios from "../axios/axios.config.js";
import { toast } from "react-toastify";
import OrderCard from "../components/OrderCard.jsx";

function OrderList() {
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [update, setUpdate] = useState(false);

  const getOrdersList = async () => {
    try {
      const { data } = await Axios.get("/api/order/");
      if (data.success) {
        setOrderList(data.orders);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setOrderLoading(false)
    };
  };

  useEffect(() => {
    getOrdersList();
  }, [update]); // refresh list whenever `update` changes

  if (orderLoading) {
    return (
      <div className="font-semibold text-xl text-center py-6 text-gray-700">
        Loading...
      </div>
    );
  }

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
