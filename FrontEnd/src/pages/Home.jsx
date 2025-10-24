import React, { useState, useEffect } from "react";
import Axios from "../axios/axios.config.js";
import hero from "../assets/Hero-image.jpeg";
import Title from "../components/Title.jsx";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard.jsx";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiSupport } from "react-icons/bi";
import { SiContactlesspayment } from "react-icons/si";
import Loading from "../components/Loading.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
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

  const renderCategory = (products, page, setPage, title) => (
    <div className="flex flex-col items-center">
      <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold border border-gray-300 rounded-md px-6 py-2 mb-6 min-w-[20vw] text-center font-title">
        <Title text1={title} />
      </h2>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          disabled={page <= 0 || loading}
          className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={48} />
        </button>

        {loading
          ? Array.from({ length: columns }).map((_, idx) => (
              <div key={idx} className="h-[300px] w-[200px] bg-gray-200 animate-pulse rounded-lg"></div>
            ))
          : Array.from({ length: columns }).map((_, idx) => {
              const product = products[page + idx];
              return product ? <ProductCard key={product._id} product={product} /> : null;
            })}

        <button
          onClick={() => setPage(prev => Math.min(prev + 1, products.length - columns))}
          disabled={page >= products.length - columns || loading}
          className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={48} />
        </button>
      </div>
    </div>
  );

  if (loading && electronics.length === 0 && homeAndKitchen.length === 0 && clothing.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-auto bg-gray-50 pb-30">
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
            <Title text1="SHOP" text2="OUR" addSolidLineBefore className="font-title" />
            <Title text1="BEST" className="font-title" />
            <Title text1="PRODUCTS" addSolidLineAfter className="font-title" />
          </div>
          <div className="mt-6">
            <button onClick={()=>{
              navigate("/shop")
            }} className="bg-blue-500 font-bold text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[26px] px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
              SHOP NOW
            </button>
          </div>
        </div>
      </section>

      {/* Products by Category */}
      <section className="mt-12 max-w-7xl mx-auto px-4 space-y-12">
        {renderCategory(electronics, elePage, setElePage, "Electronics")}
        {renderCategory(homeAndKitchen, homPage, setHomPage, "Home and Kitchen")}
        {renderCategory(clothing, cloPage, setCloPage, "Clothings")}
      </section>

      {/* Policy Section */}
      <section className="mt-12 py-12 flex flex-col align-strech border border-gray-50 w-[70vw] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 xxl:px-12 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 xxl:py-14">
        <div className="max-w-full ml-[1vw] mb-8 text-lef text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-title">
          <Title text1="Our" text2="Policy" addSolidLineAfter={true} />
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
          <div className="flex flex-col border border-gray-300 text-center px-4 py-6">
            <div className="text-5xl text-green-500">
              <LiaShippingFastSolid />
            </div>
            <h4 className="text-left text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] font-semibold text-gray-800">
              Free Shipping
            </h4>
            <p className="text-left text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] text-gray-600">
              On orders over $50
            </p>
          </div>
          <div className="flex flex-col text-center border border-gray-300 px-4 py-6">
            <div className="text-5xl text-blue-500">
              <BiSupport />
            </div>
            <h4 className="text-left text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] font-semibold text-gray-800">
              24/7 Support
            </h4>
            <p className="text-left text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] text-gray-600">
              We're here to help anytime
            </p>
          </div>
          <div className="flex flex-col text-center border border-gray-200 px-4 py-6">
            <div className="text-5xl text-yellow-400">
              <SiContactlesspayment />
            </div>
            <h4 className="text-left text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] font-semibold text-gray-800">
              Secure Payments
            </h4>
            <p className="text-left text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] text-gray-600">
              100% safe & secure
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;
