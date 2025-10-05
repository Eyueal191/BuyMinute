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
      setOrderLoading(false)};
  };
  useEffect(() => {
    getOrdersList();
  }, [update]); // refresh list whenever `update` changes
  if (orderLoading) {
    return <div className="font-semibold text-xl text-center py-4">Loading...</div>;
  }
  return (
    <div className="space-y-4 p-4">
      {orderList.length ? (
        orderList.map((order) => (
          <OrderCard key={order._id} order={order} setUpdate={setUpdate} />
        ))
      ) : (
        <div className="text-gray-600 text-center">No orders found.</div>
      )}
    </div>
  );
}
export default OrderList;
