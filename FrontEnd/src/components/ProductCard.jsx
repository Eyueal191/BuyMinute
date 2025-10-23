import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) {
    // Loader placeholder if product is null
    return (
      <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse mx-auto my-10"></div>
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
      className={`w-[240px] h-[420px] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden cursor-pointer 
                 hover:shadow-md hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
    >
      {/* Image Section */}
      <div className="w-full h-1/2 relative rounded-t-xl overflow-hidden bg-gray-100">
        {!imageLoaded && <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-t-xl" />}
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
      <div className="flex-1 p-4 flex flex-col justify-between gap-2">
        <h1 className="text-gray-900 font-bold text-base sm:text-lg truncate">
          {name || "Unnamed Product"}
        </h1>

        <h2 className="text-indigo-600 font-semibold text-sm sm:text-base">
          ${Number(price ?? 0).toFixed(2)}
        </h2>

        <h3 className="text-gray-700 font-medium text-xs sm:text-sm">
          Category: <span className="text-indigo-500 font-normal">{category?.name || "N/A"}</span>
        </h3>

        <h3 className="text-gray-700 font-medium text-xs sm:text-sm">
          SubCategory: <span className="text-indigo-500 font-normal">{subCategory?.name || "N/A"}</span>
        </h3>
      </div>
    </div>
  );
}
export default ProductCard;
