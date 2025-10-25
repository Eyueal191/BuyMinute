import React, { useContext } from "react";
import logo from "../../assets/logo.png";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

function DashBoardLayOut() {
  const { logOut } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      {/* Header */}
      <header className="w-full flex flex-col bg-gray-500 shadow-sm border-b border-gray-400">
        <nav className="flex justify-between items-center w-full px-[16px] py-[8px] sm:px-[20px] sm:py-[10px] md:px-[24px] md:py-[12px] lg:px-[28px] lg:py-[14px] xl:px-[32px] xl:py-[16px] 2xl:px-[36px] 2xl:py-[18px]">
          {/* Logo */}
          <figure className="flex items-center justify-center h-[32px] w-[80px] sm:h-[40px] sm:w-[88px] md:h-[48px] md:w-[96px] lg:h-[56px] lg:w-[104px] xl:h-[64px] xl:w-[112px] 2xl:h-[72px] 2xl:w-[120px] border-2 border-gray-300 rounded-md overflow-hidden shadow-sm">
            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-cover"
            />
          </figure>

          {/* Log Out Button */}
          <button
            onClick={logOut}
            className="bg-blue-600 text-white text-[14px] sm:text-[16px] md:text-[18px] font-semibold rounded-md px-[20px] py-[8px] sm:px-[24px] sm:py-[10px] shadow-md transition-transform duration-200 hover:bg-blue-700 hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log Out
          </button>
        </nav>

        {/* Mobile NavBar */}
        <div className="sm:hidden border-t border-gray-400">
          <NavBar />
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 bg-[#F9FAFB]">
        {/* Sidebar (desktop) */}
        <aside className="hidden sm:flex sm:flex-col sm:w-[20vw] bg-[#F9FAFB] border-r border-gray-300 shadow-sm min-h-screen">
          <NavBar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-[16px] sm:p-[24px] md:p-[28px] border-b border-gray-300">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-500 text-center py-[12px] sm:py-[16px] border-t border-gray-400 shadow-inner">
        <p className="text-[14px] sm:text-[16px] text-white">
          © {new Date().getFullYear()} My App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default DashBoardLayOut;
