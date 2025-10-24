import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) {
    // Loader placeholder if product is null
    return (
      <div className="w-[240px] h-[420px] rounded-xl bg-gray-300 animate-pulse mx-auto my-10"></div>
    );
  }

  const { _id: id, name, price, category, subCategory, images } = product;

  const handleNavigation = () => {
    if (id) navigate(`/product-detail/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && id) navigate(`/product-detail/${id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="w-[270px] h-[420px] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden cursor-pointer 
                 hover:shadow-lg hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
    >
      {/* Image Section (Taller) */}
      <div className="w-full h-[60%] relative rounded-t-xl overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-t-xl" />
        )}
        {images?.[0] ? (
          <img
            src={images[0]}
            alt={name || "Product image"}
            className={`w-full h-full object-cover transition-transform transition-opacity duration-500 
                        ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"} hover:scale-105`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <Loading />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 p-3 flex flex-col justify-start">
        {/* Product Name */}
        <h1 className="text-gray-900 font-bold text-base sm:text-lg truncate font-title">
          {name || "Unnamed Product"}
        </h1>

        {/* Price */}
        <h2 className="text-indigo-600 font-semibold text-sm sm:text-base mt-1">
          ${Number(price ?? 0).toFixed(2)}
        </h2>

        {/* Category & SubCategory (Reduced Gap) */}
        <div className="mt-1 space-y-0.5">
          <p className="text-gray-700 text-xs sm:text-sm">
            Category:{" "}
            <span className="text-indigo-500 font-medium">
              {category?.name || "N/A"}
            </span>
          </p>
          <p className="text-gray-700 text-xs sm:text-sm">
            SubCategory:{" "}
            <span className="text-indigo-500 font-medium">
              {subCategory?.name || "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
