import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../axios/axios.config";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../redux/productSlice.js";
function ProductDetails() {
  let product = useSelector((state) => state.products.product);
  let dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchProductById = async (id) => {
    try {
      console.log("id", id)
      setIsLoading(true);
      const { data } = await Axios.get(`/api/product/${id}`);
      if (data.success) {
        dispatch(setProduct(data.product));
      } else {
        toast.error(data.message || "Failed to fetch product");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch product");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id]);

  if (isLoading)
    return (
      <p className="text-gray-600 font-medium text-center py-4">
        Loading product details...
      </p>
    );

  if (!product)
    return (
      <p className="text-gray-600 font-medium text-center py-4">
        No product found.
      </p>
    );

  const mainImage = product.images?.[0];
  const otherImages = product.images?.slice(1) || [];

  const totalQuantity =
    product.sizeOption?.reduce((sum, opt) => sum + (opt.stock || 0), 0) ||
    product.quantity;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6 flex flex-col gap-6">
      {/* Images Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {mainImage && (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full md:w-2/3 h-80 object-cover rounded-xl shadow-md"
          />
        )}
        {otherImages.length > 0 && (
          <div className="flex flex-row md:flex-col gap-4 md:w-1/3">
            {otherImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 2}`}
                className="w-24 h-24 md:w-full md:h-24 object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
        <h2 className="text-lg font-medium text-gray-700">
          Base Price:{" "}
          <span className="text-blue-600 font-semibold">${product.price}</span>
        </h2>

        {/* Size Options */}
        {product.sizeOption?.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-medium mb-3">Available Sizes:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.sizeOption.map((option, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl shadow-sm border hover:shadow-md transition bg-gray-50 flex flex-col"
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    Size: {option.size}
                  </span>
                  <span className="text-sm text-gray-600">
                    Additional Price: +${option.additionalPrice || 0}
                  </span>
                  <span className="text-sm text-gray-700">
                    Stock: {option.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Quantity */}
        <h2 className="text-lg font-medium mt-4">
          Total Quantity:{" "}
          <span className="text-blue-600 font-semibold">{totalQuantity}</span>
        </h2>

        {product.description && (
          <p className="text-gray-700 text-sm mt-2">{product.description}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-transform hover:scale-105"
          onClick={() => navigate(`/product-update/${id}`)}
        >
          Update
        </button>
        <button
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition-transform hover:scale-105"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}
export default ProductDetails;
