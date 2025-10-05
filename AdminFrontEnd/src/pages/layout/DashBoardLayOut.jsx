import React from "react";
import logo from "../../assets/logo.png";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext } from "react";
function DashBoardLayOut() {
    const { logOut}=useContext(AuthContext)
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="w-full flex flex-col bg-gray-100 shadow-sm border-b border-gray-300">
        <nav className="flex justify-between items-center w-full px-4 py-1 sm:px-6 sm:py-2 md:px-8 md:py-3 lg:px-10 lg:py-4 xl:px-12 xl:py-5 2xl:px-14 2xl:py-6">
          {/* Logo */}
          <figure className="flex items-center justify-center h-8 w-20 sm:h-10 sm:w-22 md:h-12 md:w-24 lg:h-14 lg:w-26 xl:h-16 xl:w-28 2xl:h-18 2xl:w-30 border-2 border-gray-300 rounded-md overflow-hidden">
            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-cover"
            />
          </figure>
          {/* Log Out Button */}
          <button className="bg-black text-white text-label font-medium rounded-md px-6 py-2 sm:px-8 sm:py-3 shadow-lg transition-transform hover:bg-gray-900 hover:scale-105 active:scale-100 duration-200"
          onClick={logOut}>
            Log Out
          </button>
        </nav>

        {/* Mobile NavBar */}
        <div className="sm:hidden border-t border-gray-300">
          <NavBar />
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 bg-gray-50">
        {/* Sidebar (desktop) */}
        <aside className="hidden sm:flex sm:flex-col sm:w-1/5 bg-[#F9FAFB] border-r border-gray-300 shadow-sm min-h-screen">
          <NavBar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 border-b border-gray-300">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-100 text-center py-3 sm:py-4 border-t border-gray-300 shadow-inner">
        <p className="text-description secondary-accent-text">
          © {new Date().getFullYear()} My App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default DashBoardLayOut;
