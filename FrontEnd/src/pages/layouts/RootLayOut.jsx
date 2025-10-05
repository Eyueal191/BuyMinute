import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import { Toaster } from "react-hot-toast";
const RootLayout = () => {
  return (
    <div className="w-screen min-h-screen flex flex-col border bg-white">
      {/* Header */}
      <header className="w-full">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full">
        <Footer />
      </footer>
      <Toaster />
    </div>
  );
};

export default RootLayout;
