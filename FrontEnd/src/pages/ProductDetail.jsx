import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../axios/axios.config.js";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../redux/productSlice.js";
import { setUserCart } from "../redux/cartSlice.js";

function ProductDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [defaultQuantity, setDefaultQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.product);
  const userId = localStorage.getItem("userId");

  // Fetch product by ID
  const fetchProductById = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await Axios.get(`/api/product/${id}`);
      if (data.success) {
        dispatch(setProduct(data.product));
        if (data.product.sizeOption?.length) {
          const defaultSize = data.product.sizeOption[0].size;
          setSelectedSizes([defaultSize]);
          setSizeQuantities({ [defaultSize]: 1 });
        }
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

  // Toggle size selection
  const toggleSizeSelection = (size, e) => {
    if (e.target.tagName === "INPUT") return;
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    if (!sizeQuantities[size]) {
      setSizeQuantities((prev) => ({ ...prev, [size]: 1 }));
    }
  };

  // Update quantity
  const updateQuantity = (size, qty, maxStock) => {
    if (qty === "") {
      setSizeQuantities((prev) => ({ ...prev, [size]: "" }));
      return;
    }
    if (qty < 1) qty = 1;
    if (qty > maxStock) qty = maxStock;
    setSizeQuantities((prev) => ({ ...prev, [size]: qty }));
  };

  // Add to cart
  const addToCart = async () => {
    if (adding) return;
    if (!userId) return navigate("/login");

    const totalQuantity =
      product.sizeOption?.reduce((sum, opt) => sum + (opt.stock || 0), 0) ||
      product.quantity;

    if (totalQuantity <= 0) {
      toast.error("This product is currently out of stock, sorry!");
      return;
    }

    setAdding(true);
    try {
      if (product.sizeOption?.length) {
        if (!selectedSizes.length)
          return toast.error("Please select at least one size");

        for (let size of selectedSizes) {
          const option = product.sizeOption.find((opt) => opt.size === size);
          const qty = sizeQuantities[size] || 1;

          if (qty > option.stock) {
            toast.error(
              `Cannot add more than available stock for size ${size} (${option.stock})`
            );
            return;
          }

          const newItem = {
            product: product._id,
            quantity: qty,
            sizeOption: option,
          };

          const response = await Axios.post("/api/cart/", { newItem, userId });
          const data = response.data;

          if (data.success) dispatch(setUserCart(data.userCart));
          else {
            toast.error(data.message || "Failed to add product(s) to cart");
            return navigate("/login");
          }
        }
      } else {
        const qty =
          defaultQuantity > product.quantity
            ? product.quantity
            : defaultQuantity;

        if (qty <= 0) {
          toast.error("This product is currently out of stock, sorry!");
          return;
        }

        const newItem = { product: product._id, quantity: qty, sizeOption: null };
        const response = await Axios.post("/api/cart/", { newItem, userId });
        const data = response.data;

        if (data.success) dispatch(setUserCart(data.userCart));
        else toast.error(data.message || "Failed to add product(s) to cart");
      }

      toast.success("Product(s) added to cart!");
      setTimeout(() => navigate("/shop"), 300);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding to cart");
    } finally {
      setTimeout(() => setAdding(false), 10000);
    }
  };

  if (isLoading)
    return (
      <p className="text-gray-500 text-center mt-10 text-base md:text-lg animate-pulse">
        Loading product details...
      </p>
    );

  if (!product)
    return (
      <p className="text-gray-500 text-center mt-10 text-base md:text-lg">
        No product found.
      </p>
    );

  const mainImage = product.images?.[0];
  const otherImages = product.images?.slice(1) || [];
  const totalQuantity =
    product.sizeOption?.reduce((sum, opt) => sum + (opt.stock || 0), 0) ||
    product.quantity;

  return (
    <div className="my-8 max-w-4xl mx-auto p-[22px] md:p-[24px] lg:p-[26px] bg-gray-50 rounded-xl shadow-md flex flex-col gap-6 border-t border-gray-100">
      <div className="flex flex-col md:flex-row gap-5 md:gap-6">
        {/* Images */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4">
          {mainImage && (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-80 md:h-[360px] object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.03]"
            />
          )}
          {otherImages.length > 0 && (
            <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-x-visible">
              {otherImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 2}`}
                  className="w-20 h-20 md:w-full md:h-24 object-cover rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4">
          <h1 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-bold text-black leading-tight">
            {product.name}
          </h1>

          <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-gray-900">
            Price: <span className="text-indigo-600">${product.price}</span>
          </h2>

          {/* Sizes */}
          {product.sizeOption?.length > 0 ? (
            <div className="mt-3">
              <h3 className="text-[14px] sm:text-[16px] md:text-[18px] font-medium mb-2 text-gray-800">
                Available Sizes:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.sizeOption.map((option) => (
                  <div
                    key={option.size}
                    className={`p-[16px] rounded-lg border ${
                      selectedSizes.includes(option.size)
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 bg-white"
                    } shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-2 cursor-pointer`}
                    onClick={(e) => toggleSizeSelection(option.size, e)}
                  >
                    <span className="text-[16px] font-semibold text-gray-900">
                      Size: {option.size}
                    </span>
                    <span className="text-[14px] text-gray-600">
                      +${option.additionalPrice || 0} extra
                    </span>
                    <span className="text-[14px] text-gray-700">
                      Stock: {option.stock}
                    </span>
                    {selectedSizes.includes(option.size) && (
                      <input
                        type="number"
                        min={1}
                        max={option.stock}
                        value={sizeQuantities[option.size] ?? ""}
                        onChange={(e) =>
                          updateQuantity(
                            option.size,
                            e.target.value === "" ? "" : Number(e.target.value),
                            option.stock
                          )
                        }
                        className="mt-2 w-24 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <h3 className="text-[14px] sm:text-[16px] md:text-[18px] font-medium mb-2 text-gray-800">
                Quantity:
              </h3>
              <input
                type="number"
                min={1}
                max={product.quantity}
                value={defaultQuantity}
                onChange={(e) => setDefaultQuantity(Number(e.target.value))}
                className="w-24 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <h3 className="text-[14px] sm:text-[16px] md:text-[18px] font-medium mt-3 text-gray-800">
            Total Available:{" "}
            <span className="text-indigo-600 font-semibold">
              {totalQuantity}
            </span>
          </h3>

          {product.description && (
            <p className="text-[14px] md:text-[16px] text-gray-700 mt-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4 mt-5">
            <button
              disabled={totalQuantity <= 0}
              className={`px-[18px] py-[8px] rounded-md font-semibold transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${
                totalQuantity <= 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
              onClick={addToCart}
            >
              {totalQuantity <= 0 ? "Out of Stock" : "Add To Cart"}
            </button>

            <button
              className="border border-indigo-600 text-indigo-600 px-[18px] py-[8px] rounded-md font-semibold hover:bg-indigo-50 active:scale-95 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => navigate(-1)}
            >
              Back To Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetail;
