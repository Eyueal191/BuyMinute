import React, { useState, useEffect, useRef, lazy, Suspense, useCallback } from "react";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { debounce } from "lodash";
import Axios from "../axios/axios.config.js";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useSelector, useDispatch } from "react-redux";
import { setProductsList } from "../redux/productSlice.js";
import Title from "../components/Title.jsx";

// Lazy load ProductCard
const ProductCard = lazy(() => import("../components/ProductCard.jsx"));

// Skeleton loader
const ProductCardLoader = () => (
  <div className="border-b border-gray-200 rounded-lg shadow-sm p-4 animate-pulse flex flex-col gap-2">
    <div className="h-40 bg-gray-300 rounded-md"></div>
    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
    <div className="h-5 bg-gray-300 rounded w-1/2"></div>
    <div className="h-5 bg-gray-300 rounded w-1/4"></div>
  </div>
);

function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.productsList) || [];
  const parentRef = useRef();

  const [search, setSearch] = useState("");
  const [columns, setColumns] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState("");

  const subCategories = [
    { name: "Smartphones", category: "Electronics" },
    { name: "Laptops and Computers", category: "Electronics" },
    { name: "Headphones and Audio", category: "Electronics" },
    { name: "Wearables", category: "Electronics" },
    { name: "Carryables", category: "Electronics" },
    { name: "Gadgets", category: "Electronics" },
    { name: "Appliances", category: "Home & Kitchen" },
    { name: "Furniture", category: "Home & Kitchen" },
    { name: "Home Decor", category: "Home & Kitchen" },
    { name: "Kitchenware", category: "Home & Kitchen" },
    { name: "Men", category: "Shoe" },
    { name: "Women", category: "Shoe" },
    { name: "Kids", category: "Shoe" },
    { name: "Men", category: "Clothing" },
    { name: "Women", category: "Clothing" },
    { name: "Kids", category: "Clothing" },
    { name: "Belts", category: "Accessories" },
    { name: "Bags", category: "Accessories" },
    { name: "Jewelry", category: "Accessories" },
  ];

  // Responsive columns
  useEffect(() => {
    const updateColumns = () => setColumns(window.innerWidth < 768 ? 1 : 2);
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Debounced search
  const debouncedSetSearch = useCallback(
    debounce((value) => setSearch(value), 500),
    []
  );
  const handleSearchChange = (e) => debouncedSetSearch(e.target.value);

  // Sidebar checkbox handler
  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    const category = subCategories.find((sub) => sub.name === name)?.category;
    if (!category) return;

    setSelectedSubCategories((prev) => {
      const updated = checked ? [...prev, name] : prev.filter((item) => item !== name);
      const categories = subCategories
        .filter((sub) => updated.includes(sub.name))
        .map((sub) => sub.category);
      setSelectedCategories([...new Set(categories)]);
      return updated;
    });
  };

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const params = {
        search: search || undefined,
        selectedCategories: JSON.stringify(selectedCategories),
        selectedSubCategories: JSON.stringify(selectedSubCategories),
        priceMin,
        priceMax: priceMax || undefined,
      };
      const response = await Axios.get("/api/product", { params });
      dispatch(setProductsList(response.data.products || []));
    } catch (error) {
      console.error(error?.response?.data?.message || error.message);
    }
  }, [search, selectedCategories, selectedSubCategories, priceMin, priceMax, dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Virtualizer
  const rowCount = Math.ceil(products.length / columns);
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (columns === 1 ? 430 : 240), // adjusted for smaller vertical gap
    overscan: 3,
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 md:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-80 bg-white md:bg-gray-700 md:text-white p-6 shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-semibold">Filters</h2>
          <IoMdClose
            size={28}
            className="cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        <div className="hidden md:block mb-4">
          <Title
            text1="Filter"
            addSolidLineAfter={true}
            text1Color="text-white"
            lineColor="bg-white"
          />
        </div>

        <div className="flex flex-col gap-4">
          {["Electronics", "Home & Kitchen", "Shoe", "Clothing", "Accessories"].map((cat) => {
            const items = subCategories.filter((sub) => sub.category === cat).map((sub) => sub.name);
            return (
              <div key={cat} className="p-4 bg-gray-100 md:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-800 md:text-gray-100 mb-2">{cat}</h3>
                {items.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-gray-700 md:text-gray-200">
                    <input
                      type="checkbox"
                      name={item}
                      onChange={handleCheckbox}
                      className="accent-indigo-500 cursor-pointer"
                    />
                    {item}
                  </label>
                ))}
              </div>
            );
          })}

          {/* Price */}
          <div className="p-4 bg-gray-100 md:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-800 md:text-gray-100 mb-2">Price Range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-20 rounded-md px-2 py-1 text-base border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value) || "")}
                className="w-20 rounded-md px-2 py-1 text-base border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile toggle button */}
      <button
        className="md:hidden bg-indigo-500 text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => setSidebarOpen(true)}
      >
        Show Filters
      </button>

      {/* Main content */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-md p-4 relative">
        {/* Search Bar */}
        <div className="w-full flex justify-center mb-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              onChange={handleSearchChange}
              className="bg-white w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <IoMdSearch
              size={24}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Product List */}
        {products.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No products found.</p>
        ) : (
          <div
            ref={parentRef}
            className="relative overflow-auto w-full h-[80vh] scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 bg-gray-100 rounded-lg"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const startIndex = virtualRow.index * columns;
                const endIndex = Math.min(startIndex + columns, products.length);
                const rowProducts = products.slice(startIndex, endIndex);

                return (
                  <div
                    key={virtualRow.key}
                    className="grid gap-x-6" // reduced vertical gap
                    style={{
                      gridTemplateColumns: `repeat(${columns}, 1fr)`,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {rowProducts.map((product) => (
                      <Suspense key={product._id} fallback={<ProductCardLoader />}>
                        <ProductCard {...product} />
                      </Suspense>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
