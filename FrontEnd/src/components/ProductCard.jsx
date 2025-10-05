import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) {
    // Loader placeholder if product is null
    return (
      <div className="w-5 h-5 rounded-full bg-gray-300 animate-ping mx-auto my-10"></div>
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
      className="h-[420px] w-full sm:w-[200px] md:w-[270px] rounded-2xl overflow-hidden shadow-md border border-gray-200 cursor-pointer hover:shadow-xl hover:border-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
    >
      {/* Image with loading skeleton */}
      <div className="h-1/2 w-full relative overflow-hidden bg-gray-100 rounded-t-2xl">
        {!imageLoaded && <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>}
        {!images[0] ? (<Loading />) : ( <img
          src={images?.[0] || "placeholder.jpg"}
          alt={name ? `${name} image` : "Product image"}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />)}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col justify-between h-1/2 bg-white">
        <h1 className="text-gray-900 font-semibold text-sm sm:text-base md:text-lg lg:text-xl xxl:text-2xl truncate">
          {name || "Unnamed Product"}
        </h1>

        {/* Price */}
        <h2 className="text-indigo-600 font-bold text-sm sm:text-base md:text-lg lg:text-xl xxl:text-2xl">
          ${Number(price ?? 0).toFixed(2)}
        </h2>

        {/* Category */}
        <h3 className="font-medium text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg xxl:text-xl">
          Category: <span className="text-indigo-500 font-normal">{category?.name || "N/A"}</span>
        </h3>

        {/* SubCategory */}
        <h3 className="font-medium text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg xxl:text-xl">
          SubCategory: <span className="text-indigo-500 font-normal">{subCategory?.name || "N/A"}</span>
        </h3>
      </div>
    </div>
  );
}

export default ProductCard;
