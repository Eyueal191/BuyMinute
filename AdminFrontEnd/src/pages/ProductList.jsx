import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Axios from "../axios/axios.config.js";
import ProductCard from "../components/ProductCard.jsx";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useSelector, useDispatch } from "react-redux";
import { setProductsList } from "../redux/productSlice.js";

function ProductList() {
  const products = useSelector((state) => state.products.productsList); // fixed
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const parentRef = useRef();

  const rowCounts = products?.length || 0;

  const rowVirtualizer = useVirtualizer({
    count: rowCounts,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 170,
    overscan: 3,
  });

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("/api/product");
      const data = response.data;

      if (data.success) {
        dispatch(setProductsList(data.products)); // store in Redux
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch products";
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-main-heading mb-6">Product List</h1>

      {loading ? (
        <p className="text-description text-gray-500">Loading products...</p>
      ) : rowCounts === 0 ? (
        <p className="text-description text-gray-500">No products found.</p>
      ) : (
        <div
          ref={parentRef}
          className="relative overflow-auto w-full border border-gray-300 rounded-md mx-auto h-screen py-6 bg-gray-50"
        >
          <div
            className="flex flex-col gap-6"
            style={{
              position: "relative",
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const index = virtualRow.index;
              const product = products[index];
              if (!product) return null;

              return (
                <div
                  key={product._id}
                  className="px-4"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    images={product.images}
                    price={product.price}
                    quantity={product.quantity}
                    className="border-b border-gray-200"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
