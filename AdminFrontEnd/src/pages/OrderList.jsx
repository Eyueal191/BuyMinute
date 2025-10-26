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
    <div>
<div className="flex items-center mb-6">
  <h1 className="text-2xl font-bold text-gray-800 mr-4">
    Orders List
  </h1>
  <hr className="border-t-4 border-gray-600 w-[80px] mt-[20px]" />
</div>


      <div>
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

    </div>
  );
}

export default OrderList;
