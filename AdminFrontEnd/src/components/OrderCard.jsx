import React from "react";
import OrderItemCard from "./OrderItemCard.jsx";
function OrderCard({ order, setUpdate }) {
  const { user, items } = order;
  return (
    <div className="flex flex-col gap-6 p-6">
      {items.map((item) => ( 
        <OrderItemCard 
          key={item._id} 
          item={item} 
          user={user} 
          setUpdate={setUpdate}
        />
      ))}
    </div>
  );
}

export default OrderCard;
