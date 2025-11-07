import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ _id, name, images, price, quantity }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        w-full 
        xs:w-[360px] 
        sm:w-[400px] 
        md:w-[440px] 
        lg:w-[480px] 
        xl:w-[520px] 
        2xl:w-[560px]
        flex flex-col md:flex-row justify-between
        p-4 sm:p-5 md:p-6 bg-white border border-[#E5E7EB] rounded-md shadow-sm
        hover:shadow-md transition-shadow duration-300 ease-in-out
      "
    >
      {/* Image */}
      <figure
        className="
          w-full sm:w-44 md:w-48 lg:w-52 xl:w-56 2xl:w-60 
          h-48 sm:h-36 md:h-40 lg:h-44 xl:h-48 2xl:h-52
          flex-shrink-0 rounded-md overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB]
          shadow-xs hover:shadow-sm transition-shadow duration-200 mb-4 md:mb-0
        "
      >
        <img
          src={images[0]}
          alt={name}
          className="object-cover w-full h-full"
        />
      </figure>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between px-0 sm:px-4">
        <div>
          <h1 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#111827] truncate">
            {name}
          </h1>
          <h2 className="text-[14px] sm:text-[15px] text-[#4B5563] mt-1">
            Price: <span className="font-medium text-[#111827]">${price}</span>
          </h2>
          <h2 className="text-[14px] sm:text-[15px] text-[#4B5563] mt-1">
            Quantity: <span className="font-medium text-[#111827]">{quantity}</span>
          </h2>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-2">
          <button
            className="
              bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] font-medium
              rounded-md px-4 py-2 shadow-sm hover:shadow-md
              transition-all duration-200 w-full md:w-auto
            "
            onClick={() => navigate(`/product-update/${_id}`)}
          >
            Update
          </button>
          <button
            className="
              bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-[14px] font-medium
              rounded-md px-4 py-2 shadow-sm hover:shadow-md
              transition-all duration-200 w-full md:w-auto
            "
            onClick={() => navigate(`/product-detail/${_id}`)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
