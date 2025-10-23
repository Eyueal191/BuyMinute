import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ id, name, images, price, quantity }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        w-full flex justify-between items-center
        p-[18px] sm:p-[20px] md:p-[22px] lg:p-[24px]
        bg-white border border-[#E5E7EB] rounded-md shadow-sm
        hover:shadow-md transition-shadow duration-300 ease-in-out
      "
    >
      {/* Image */}
      <figure
        className="
          w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 min-w-[96px]
          rounded-md overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB]
          shadow-xs hover:shadow-sm transition-shadow duration-200
        "
      >
        <img
          src={images[0]}
          alt={name}
          className="object-cover w-full h-full"
        />
      </figure>

      {/* Product Info */}
      <div className="flex-1 px-3 flex flex-col justify-center space-y-1">
        <h1 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#111827] truncate">
          {name}
        </h1>
        <h2 className="text-[14px] sm:text-[15px] text-[#4B5563]">
          Price: <span className="font-medium text-[#111827]">${price}</span>
        </h2>
        <h2 className="text-[14px] sm:text-[15px] text-[#4B5563]">
          Quantity: <span className="font-medium text-[#111827]">{quantity}</span>
        </h2>
      </div>

      {/* Actions */}
      <div className="flex flex-col lg:flex-row gap-2 h-full items-center mt-2 lg:mt-0">
        <button
          className="
            bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] font-medium
            rounded-md px-4 py-2 shadow-sm hover:shadow-md
            transition-all duration-200 w-full lg:w-auto
          "
          onClick={() => navigate(`/product-update/${id}`)}
        >
          Update
        </button>
        <button
          className="
            bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-[14px] font-medium
            rounded-md px-4 py-2 shadow-sm hover:shadow-md
            transition-all duration-200 w-full lg:w-auto
          "
          onClick={() => navigate(`/product-detail/${id}`)}
        >
          View
        </button>
      </div>
    </div>
  );
}
export default ProductCard;
