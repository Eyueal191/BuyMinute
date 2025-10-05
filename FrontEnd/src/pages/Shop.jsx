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
  // ----------------------
  // Filters / State
  // ----------------------
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

  // ----------------------
  // Search with debounce
  // ----------------------
  const debouncedSetSearch = useCallback(
    debounce((value) => setSearch(value), 500),
    []
  );
  const handleSearchChange = (e) => {
    debouncedSetSearch(e.target.value);
  };

  // ----------------------
  // Category change handler
  // ----------------------
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

  // ----------------------
  // Fetch Products
  // ----------------------
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
  // ----------------------
  // Responsive columns
  // ----------------------
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
  // ----------------------
  // Virtualized list
  // ----------------------
  const rowCount = Math.ceil(products.length / columns);
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 450,
    overscan: 3,
  });
  return (
    <div className="w-full py-6 bg-gray-50">
      {/* Search Bar */}
      <div className="w-full flex justify-center mb-6 px-4 sm:px-0">
        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl">
          <input
            type="text"
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="bg-white w-full border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <IoMdSearch
            size={28}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row gap-6 px-4 sm:px-0">
        {/* Sidebar filters */}
        <div className="w-full sm:w-1/5 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-4 my-4">
            <Title text1="Filter" addSolidLineAfter={true} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
              {["Electronics", "Home & Kitchen", "Shoe", "Clothing", "Accessories"].map(
            (category) => (
              <div key={category} className="mb-4 border border-gray-400 p-4 rounded">
                <h3 className="font-semibold mb-2">{category}</h3>
                {subCategories
                  .filter((sub) => sub.category === category)
                  .map((item) => (
                    <label
                      key={item.name}
                      className="block text-sm mb-1 flex items-center gap-2"
                    >
                      <input type="checkbox" name={item.name} onChange={changeHandler} />
                      {item.name}
                    </label>
                  ))}
              </div>
            )
          )}
          {/* Price Range */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-16 rounded px-2 py-1 text-xs border border-gray-200"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-16 rounded px-2 py-1 text-xs border border-gray-200"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value) || "")}
              />
            </div>
          </div>
        </div>
          </div>
        

        {/* Product list */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <div ref={parentRef} className="relative overflow-auto w-full h-screen">
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
                      className="px-1 grid gap-6 py-2"
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
