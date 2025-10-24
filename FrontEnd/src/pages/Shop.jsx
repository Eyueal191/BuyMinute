import React, { useEffect, useState, useCallback, useRef } from "react";
import Title from "../components/Title.jsx";
import { IoMdSearch } from "react-icons/io";
import { debounce } from "lodash";
import Axios from "../axios/axios.config.js";
import { useVirtualizer } from "@tanstack/react-virtual";
import ProductCard from "../components/ProductCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/productSlice.js";
import Loading from "../components/Loading.jsx";

function Shop() {
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

  const [search, setSearch] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMax, setPriceMax] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [columns, setColumns] = useState(1);
  const [loading, setLoading] = useState(false);

  const parentRef = useRef();
  const products = useSelector((state) => state.product.products) || [];
  const dispatch = useDispatch();

  const debouncedSetSearch = useCallback(
    debounce((value) => setSearch(value), 500),
    []
  );
  const handleSearchChange = (e) => debouncedSetSearch(e.target.value);

  const changeHandler = (e) => {
    const { name, checked } = e.target;
    const category = subCategories.find((subcat) => subcat.name === name)?.category;
    if (!category) return;
    setSelectedSubCategories((prev) => {
      const updated = checked ? [...prev, name] : prev.filter((item) => item !== name);
      const selectedCats = subCategories
        .filter((sub) => updated.includes(sub.name))
        .map((sub) => sub.category);
      setSelectedCategories([...new Set(selectedCats)]);
      return updated;
    });
  };

  const fetchProductsList = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search,
        selectedCategories: JSON.stringify(selectedCategories),
        selectedSubCategories: JSON.stringify(selectedSubCategories),
        priceMax: priceMax || undefined,
        priceMin,
      };
      const response = await Axios.get("/api/product", { params });
      dispatch(setProducts(response.data.products || []));
    } catch (error) {
      console.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategories, selectedSubCategories, priceMax, priceMin, dispatch]);

  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  useEffect(() => {
    const breakpoints = { md: 768, lg: 1024, xl: 1280 };
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < breakpoints.md) setColumns(1);
      else if (width < breakpoints.lg) setColumns(2);
      else if (width < breakpoints.xl) setColumns(3);
      else setColumns(4);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const rowCount = Math.ceil(products.length / columns);
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 450,
    overscan: 3,
  });

  return (
    <div className="w-full py-8 bg-gray-50 min-h-screen px-4 md:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="w-full flex justify-center mb-8">
        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl">
          <input
            type="text"
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="bg-white w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <IoMdSearch
            size={24}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-6 md:gap-8">
        {/* Sidebar filters */}
        <div className="w-full sm:w-[320px] bg-white sm:bg-gray-700 sm:text-white p-[18px] md:p-[20px] rounded-xl border border-gray-200 sm:border-gray-600 shadow-md">
          <div className="px-2 my-4">
            <Title
              text1="Filter"
              addSolidLineAfter={true}
              text1Color={columns === 1 ? "text-black" : "text-white"}
              lineColor={columns === 1 ? "bg-black" : "bg-white"}
            />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 md:gap-5 px-2">
            {[
              {
                title: "Electronics",
                items: [
                  "Smartphones",
                  "Laptops and Computers",
                  "Headphones and Audio",
                  "Wearables",
                  "Carryables",
                  "Gadgets",
                ],
              },
              {
                title: "Home & Kitchen",
                items: ["Appliances", "Furniture", "Home Decor", "Kitchenware"],
              },
              { title: "Shoe", items: ["Men", "Women", "Kids"] },
              { title: "Clothing", items: ["Men", "Women", "Kids"] },
              { title: "Accessories", items: ["Belts", "Bags", "Jewelry"] },
            ].map((section, i) => (
              <div
                key={i}
                className="border border-gray-200 sm:border-gray-500 rounded-xl p-[16px] md:p-[18px] bg-white sm:bg-gray-800 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-[16px] sm:text-[18px] font-semibold mb-3 text-gray-800 sm:text-gray-100 font-title">
                  {section.title}
                </h3>
                {section.items.map((name) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 mb-2 text-[14px] sm:text-[16px] text-gray-700 sm:text-gray-200"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      onChange={changeHandler}
                      className="accent-indigo-500 cursor-pointer"
                    />
                    {name}
                  </label>
                ))}
              </div>
            ))}

            {/* Price Range */}
            <div className="border border-gray-200 sm:border-gray-500 rounded-xl p-[16px] md:p-[18px] bg-white sm:bg-gray-800">
              <h3 className="text-[16px] sm:text-[18px] font-semibold mb-3 text-gray-800 sm:text-gray-100 font-title">
                Price Range
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-20 rounded-md px-2 py-1 text-base border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-20 rounded-md px-2 py-1 text-base border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value) || "")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-md p-[2px] md:p-[6px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <div
              ref={parentRef}
              className="relative overflow-auto w-[400px]  sm:w-[95%] mx-auto border border-gray-50 h-[150vh] py-4 sm:px-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
            >
              <div
                style={{
                  position: "relative",
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const startIndex = virtualRow.index * columns;
                  const endIndex = Math.min(startIndex + columns, products.length);
                  const rowProducts = products.slice(startIndex, endIndex);
                  return (
                    <div
                      key={virtualRow.key}
                      className="px-20 sm:px-2 grid gap-4 md:gap-6 py-3"
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
                        <ProductCard
                          product={product}
                          key={product._id || product.id || product.name}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Shop;
