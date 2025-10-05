import React, { useState, useEffect } from "react";
import Axios from "../axios/axios.config.js";
import hero from "../assets/Hero-image.jpeg";
import Title from "../components/Title.jsx";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard.jsx";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiSupport } from "react-icons/bi";
import { SiContactlesspayment } from "react-icons/si";

function Home() {
  const [loading, setLoading] = useState(false);
  const [electronics, setElectronics] = useState([]);
  const [homeAndKitchen, setHomeAndKitchen] = useState([]);
  const [clothing, setClothing] = useState([]);
  const [elePage, setElePage] = useState(0);
  const [homPage, setHomPage] = useState(0);
  const [cloPage, setCloPage] = useState(0);
  const [columns, setColumns] = useState(2);

  const tailwindBreakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

  const fetchProductsList = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const params = { category: JSON.stringify(["Electronics", "Home & Kitchen", "Clothing"]) };
      const response = await Axios.get("/api/product", { params });
      const data = response.data;
      if (data.success) {
        const getCategoryProducts = (name) =>
          data.products.filter(p => p.category?.name?.toLowerCase() === name.toLowerCase()) || [];

        setElectronics(getCategoryProducts("Electronics"));
        setHomeAndKitchen(getCategoryProducts("Home & Kitchen"));
        setClothing(getCategoryProducts("Clothing"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getColumns = () => {
    const width = window.innerWidth;
    if (width < tailwindBreakpoints.sm) setColumns(1);
    else if (width < tailwindBreakpoints.md) setColumns(2);
    else if (width < tailwindBreakpoints.lg) setColumns(3);
    else setColumns(4);
  };

  useEffect(() => {
    window.addEventListener("resize", getColumns);
    getColumns();
    return () => window.removeEventListener("resize", getColumns);
  }, []);

  useEffect(() => {
    fetchProductsList();
  }, []);

  return (
    <div className="w-full h-auto bg-white">
      {/* Hero Section */}
      <section className="flex flex-col sm:flex-row max-w-6xl mx-auto px-4 py-8 gap-0">
        <div className="flex-1">
          <img
            src={hero}
            alt="Hero Banner"
            className="w-full h-full object-cover rounded-l-2xl shadow-lg transform transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center text-center sm:text-left bg-white px-6 py-8 rounded-r-2xl space-y-6 shadow-md">
          <div className="flex flex-col bg-gray-100 py-4 px-6 rounded">
            <Title text1="SHOP" text2="OUR" addSolidLineBefore />
            <Title text1="BEST" />
            <Title text1="PRODUCTS" addSolidLineAfter />
          </div>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
              SHOP NOW
            </button>
          </div>
        </div>
      </section>
      {/* Products by Category */}
      <section className="mt-12 max-w-7xl mx-auto px-4 space-y-12">
        {/* Electronics */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold border border-gray-300 rounded-md px-6 py-2 mb-6 min-w-[20vw] text-center">
            <Title text1="Electronics" />
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setElePage(prev => Math.max(prev - 1, 0))}
              disabled={elePage <= 0}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaLessThan size={48} />
            </button>
            {columns >= 1 && electronics[elePage] && <ProductCard product={electronics[elePage]} />}
            {columns >= 2 && electronics[elePage + 1] && <ProductCard product={electronics[elePage + 1]} />}
            {columns >= 3 && electronics[elePage + 2] && <ProductCard product={electronics[elePage + 2]} />}
            {columns >= 4 && electronics[elePage + 3] && <ProductCard product={electronics[elePage + 3]} />}
            <button
              onClick={() => setElePage(prev => Math.min(prev + 1, electronics.length - columns))}
              disabled={elePage >= electronics.length - columns}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGreaterThan size={48} />
            </button>
          </div>
        </div>
        {/* Home & Kitchen */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold border border-gray-300 rounded-md px-6 py-2 mb-6 text-center">
            <Title text1="Home & Kitchen" />
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setHomPage(prev => Math.max(prev - 1, 0))}
              disabled={homPage <= 0}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaLessThan size={48} />
            </button>
            {columns >= 1 && homeAndKitchen[homPage] && <ProductCard product={homeAndKitchen[homPage]} />}
            {columns >= 2 && homeAndKitchen[homPage + 1] && <ProductCard product={homeAndKitchen[homPage + 1]} />}
            {columns >= 3 && homeAndKitchen[homPage + 2] && <ProductCard product={homeAndKitchen[homPage + 2]} />}
            {columns >= 4 && homeAndKitchen[homPage + 3] && <ProductCard product={homeAndKitchen[homPage + 3]} />}
            <button
              onClick={() => setHomPage(prev => Math.min(prev + 1, homeAndKitchen.length - columns))}
              disabled={homPage >= homeAndKitchen.length - columns}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGreaterThan size={48} />
            </button>
          </div>
        </div>
        {/* Clothing */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold border border-gray-300 rounded-md px-6 py-2 mb-6 text-center">
            <Title text1="Clothing" />
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCloPage(prev => Math.max(prev - 1, 0))}
              disabled={cloPage <= 0}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaLessThan size={48} />
            </button>
            {columns >= 1 && clothing[cloPage] && <ProductCard product={clothing[cloPage]} />}
            {columns >= 2 && clothing[cloPage + 1] && <ProductCard product={clothing[cloPage + 1]} />}
            {columns >= 3 && clothing[cloPage + 2] && <ProductCard product={clothing[cloPage + 2]} />}
            {columns >= 4 && clothing[cloPage + 3] && <ProductCard product={clothing[cloPage + 3]} />}
            <button
              onClick={() => setCloPage(prev => Math.min(prev + 1, clothing.length - columns))}
              disabled={cloPage >= clothing.length - columns}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGreaterThan size={48} />
            </button>
          </div>
        </div>
      </section>
      {/* Policy Section */}
      <section className="mt-12 bg-white py-12">
        <div className="text-center py-4 mb-4"><Title text1="Our" text2="Policy" addSolidLineAfter={true} /></div>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="text-4xl text-green-500">
              <LiaShippingFastSolid />
            </div>
            <h4 className="text-xl font-semibold">Free Shipping</h4>
            <p className="text-gray-500">On orders over $50</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="text-4xl text-blue-500">
              <BiSupport />
            </div>
            <h4 className="text-xl font-semibold">24/7 Support</h4>
            <p className="text-gray-500">We're here to help anytime</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="text-4xl text-yellow-400">
              <SiContactlesspayment />
            </div>
            <h4 className="text-xl font-semibold">Secure Payments</h4>
            <p className="text-gray-500">100% safe & secure</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
