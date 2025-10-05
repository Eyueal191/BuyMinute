import React from "react";
import { useNavigate } from "react-router-dom";
function ProductCard({ id, name, images, price, quantity }) {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Image */}
      <figure className="w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 min-w-[96px]">
        <img
          src={images[0]}
          alt={name}
          className="object-cover w-full h-full rounded-md"
        />
      </figure>

      {/* Product Info */}
      <div className="flex-1 px-3 flex flex-col justify-center">
        <h1 className="text-main-heading font-semibold leading-tight truncate">{name}</h1>
        <h2 className="text-subheading secondary-accent-text leading-snug">Price: ${price}</h2>
        <h2 className="text-label secondary-accent-text leading-snug">Quantity: {quantity}</h2>
      </div>

      {/* Actions */}
      <div className="flex flex-col lg:flex-row gap-2 h-full items-center">
        <button
          className="btn-primary text-white rounded-md px-3 py-1 transition-colors w-full lg:w-auto"
          onClick={() => navigate(`/product-update/${id}`)}
        >
          Update
        </button>
        <button
          className="btn-secondary text-gray-800 rounded-md px-3 py-1 transition-colors w-full lg:w-auto"
          onClick={() => navigate(`/product-detail/${id}`)}
        >
          View
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
