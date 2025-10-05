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
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.product);
  const  userId = localStorage.getItem("userId");

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

  // Toggle size selection but ignore clicks on input
  const toggleSizeSelection = (size, e) => {
    if (e.target.tagName === "INPUT") return; // prevent deselect on input click

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
    if (!userId) return toast.error("You must be logged in to add to cart");

    try {
      if (product.sizeOption?.length) {
        if (!selectedSizes.length) return toast.error("Please select at least one size");

        for (let size of selectedSizes) {
          const option = product.sizeOption.find((opt) => opt.size === size);
          const qty = sizeQuantities[size] || 1;

          if (qty > option.stock) {
            toast.error(`Cannot add more than available stock for size ${size} (${option.stock})`);
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
          else toast.error(data.message || "Failed to add product(s) to cart");
        }
      } else {
        const qty = defaultQuantity > product.quantity ? product.quantity : defaultQuantity;
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
    }
  };

  if (isLoading)
    return (
      <p className="text-gray-500 text-center mt-10 text-lg animate-pulse">
        Loading product details...
      </p>
    );

  if (!product)
    return (
      <p className="text-gray-500 text-center mt-10 text-lg">No product found.</p>
    );

  const mainImage = product.images?.[0];
  const otherImages = product.images?.slice(1) || [];
  const totalQuantity =
    product.sizeOption?.reduce((sum, opt) => sum + (opt.stock || 0), 0) || product.quantity;
  return (
    <div className="my-8 max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-xl flex flex-col gap-8 border-t border-gray-50">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Images */}
        <div className="flex-1 flex flex-col gap-4">
          {mainImage && (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-80 md:h-[360px] object-cover rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
          )}
          {otherImages.length > 0 && (
            <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-x-visible">
              {otherImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 2}`}
                  className="w-20 h-20 md:w-full md:h-24 object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
          <h2 className="text-xl font-semibold text-indigo-600">
            Price: <span className="text-gray-700">${product.price}</span>
          </h2>
          {/* Size Options */}
          {product.sizeOption?.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Available Sizes:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.sizeOption.map((option) => (
                  <div
                    key={option.size}
                    className={`p-4 rounded-2xl border ${
                      selectedSizes.includes(option.size)
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 bg-gray-50"
                    } shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-2 cursor-pointer`}
                    onClick={(e) => toggleSizeSelection(option.size, e)}
                  >
                    <span className="font-semibold text-lg text-gray-900">
                      Size: {option.size}
                    </span>
                    <span className="text-gray-600">
                      Additional Price: +${option.additionalPrice || 0}
                    </span>
                    <span className="text-gray-700">Stock: {option.stock}</span>
                    {selectedSizes.includes(option.size) && (
                      <input
                        type="number"
                        min={1}
                        max={option.stock}
                        value={sizeQuantities[option.size] ?? ""}
                        onChange={(e) =>
                          updateQuantity(option.size, e.target.value === "" ? "" : Number(e.target.value), option.stock)
                        }
                        className="mt-2 w-24 border rounded px-2 py-1"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Quantity:</h3>
              <input
                type="number"
                min={1}
                max={product.quantity}
                value={defaultQuantity}
                onChange={(e) => setDefaultQuantity(Number(e.target.value))}
                className="w-24 border rounded px-2 py-1"
              />
            </div>
          )}
          <h3 className="text-lg font-semibold mt-4 text-gray-800">
            Total Available: <span className="text-indigo-600 font-bold">{totalQuantity}</span>
          </h3>
          {product.description && (
            <p className="text-gray-600 mt-2 leading-relaxed">{product.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-2xl font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-md"
              onClick={addToCart}
            >
             Add To Cart
            </button>
            <button
              className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-2xl font-semibold hover:bg-indigo-50 transition-colors duration-300 shadow-sm"
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
