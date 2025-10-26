import React, { lazy, Suspense, useState } from "react";
import logo from "../../assets/logo.png";
import { Outlet, Navigate, useNavigate } from "react-router-dom";

// Lazy load NavBar
const NavBar = lazy(() => import("../../components/NavBar.jsx"));

// Stylish skeleton loader for fallback
const LoaderFallback = () => (
  <div className="flex flex-col gap-2 p-4">
    <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
    <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
    <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
  </div>
);

function DashBoardLayOut() {
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loggedIn");

    // Trigger re-render
    setLoggedOut(true);

    // Optional: navigate immediately
    navigate("/login", { replace: true });
  };

  if (loggedOut) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-[#1F2937]">
      {/* Header with gradient */}
      <header className="w-full flex flex-col bg-gray-500 shadow-sm border-b border-gray-400">
        <nav className="flex justify-between items-center w-full px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-6">
          {/* Logo */}
          <figure className="flex items-center justify-center h-10 w-24 sm:h-12 sm:w-28 md:h-14 md:w-32 lg:h-16 lg:w-36 border-2 border-gray-300 rounded-md overflow-hidden shadow-sm bg-white">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </figure>

          {/* Log Out Button */}
          <button
            onClick={logOut}
            className="bg-blue-500 font-semibold text-white rounded-md px-6 py-2 sm:px-8 sm:py-3 shadow-md hover:bg-blue-600 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Log Out
          </button>
        </nav>

        {/* Mobile NavBar */}
        <div className="sm:hidden border-t border-gray-400">
          <Suspense fallback={<LoaderFallback />}>
            <NavBar />
          </Suspense>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 bg-[#F9FAFB]">
        {/* Sidebar (desktop) */}
        <aside className="hidden sm:flex sm:flex-col sm:w-[20vw] bg-[#F9FAFB] border-r border-gray-300 shadow-sm min-h-screen">
          <Suspense fallback={<LoaderFallback />}>
            <NavBar />
          </Suspense>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 border-b border-gray-300">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-500 text-center py-4 sm:py-6 border-t border-gray-400 shadow-inner">
        <p className="text-sm sm:text-base text-white">
          © {new Date().getFullYear()} My App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default DashBoardLayOut;
