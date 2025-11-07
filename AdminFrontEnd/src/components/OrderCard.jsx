import React from "react";
import OrderItemCard from "./OrderItemCard.jsx";

function OrderCard({ order, setUpdate }) {
  const { user, items } = order;

  // If items are missing, render nothing
  if (!items?.length) return null;

  return (
    <div
      className="
        flex flex-col gap-[20px]
        p-[18px] sm:p-[20px] md:p-[22px] lg:p-[24px]
        bg-white rounded-md shadow-sm border border-[#E5E7EB]
        text-[#1F2937]
      "
    >
      {/* Map through order items */}
      {items.map((item) => (
        <OrderItemCard
          key={item._id}
          item={item}
          user={user || { name: "Unknown User" }}
          setUpdate={setUpdate}
        />
      ))}
    </div>
  );
}

export default OrderCard;
