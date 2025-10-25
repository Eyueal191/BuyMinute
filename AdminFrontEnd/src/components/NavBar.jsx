import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UploadCloud, Clipboard, Box } from "lucide-react";

function NavBar() {
  const location = useLocation();

  const links = [
    { to: "upload", label: "Upload", icon: <UploadCloud size={20} /> },
    { to: "order-list", label: "Order List", icon: <Clipboard size={20} /> },
    { to: "product-list", label: "Product List", icon: <Box size={20} /> },
  ];

  return (
    <nav className="flex flex-col sm:flex-col w-full sm:w-[20vw] bg-white shadow-md p-2 rounded-md border border-gray-300">
      {links.map((link) => {
        const isActive = location.pathname.includes(link.to);
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 m-1 rounded-md transition-all duration-200 ${
              isActive
                ? "bg-blue-100 border-l-4 border-blue-500 scale-105"
                : "hover:bg-gray-100 hover:scale-105"
            } text-gray-800`}
          >
            <span
              className={`transition-colors duration-200 ${
                isActive ? "text-blue-500" : "text-gray-800"
              }`}
            >
              {link.icon}
            </span>
            <span className="font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default NavBar;
