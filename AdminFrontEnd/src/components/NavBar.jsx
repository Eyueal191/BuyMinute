import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
function NavBar() {
  return (
    <nav className="flex justify-around px-4 sm:flex-col w-full sm:w-[20vw] p-0 bg-gray-100 shadow-md border border-gray-300">
      {/* Upload */}
      <Link
        to="upload"
        className="flex items-start gap-2 button-padding text-label secondary-accent-text hover:bg-blue-100 hover:text-blue-600 transition"
      >
        <Icon
          icon="el:upload"
          className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px] lg:w-[26px] lg:h-[26px] xl:w-[30px] xl:h-[30px] mt-1"
        />
        <span className="text-label">Upload</span>
      </Link>
      <hr className="border-t m-0" style={{ borderColor: "#E5E7EB" }} />
      {/* Order List */}
      <Link
        to="order-list"
        className="flex items-start gap-2 button-padding text-label secondary-accent-text hover:bg-blue-100 hover:text-blue-600 transition"
      >
        <Icon
          icon="mdi:clipboard-list"
          className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px] lg:w-[26px] lg:h-[26px] xl:w-[30px] xl:h-[30px] mt-1"
        />
        <span className="text-label">Order List</span>
      </Link>
      <hr className="border-t m-0" style={{ borderColor: "#E5E7EB" }} />
      {/* Product List */}
      <Link
        to="product-list"
        className="flex items-start gap-2 button-padding text-label secondary-accent-text hover:bg-blue-100 hover:text-blue-600 transition"
      >
        <Icon
          icon="vaadin:modal-list"
          className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px] lg:w-[26px] lg:h-[26px] xl:w-[30px] xl:h-[30px] mt-1"
        />
        <span className="text-label">Product List</span>
      </Link>
    </nav>
  );
}
export default NavBar;
