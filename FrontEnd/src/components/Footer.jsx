import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

function Footer() {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "py-1 px-2 text-blue-600 font-semibold"
      : "py-1 px-2 text-gray-500 hover:text-blue-600 transition-colors duration-300";

  return (
    <footer className="bg-gray-100 border-t border-gray-200 w-full py-10 px-6">
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <section className="flex flex-col gap-2 items-center sm:items-start">
          <figure className="flex flex-col items-center gap-2 cursor-pointer">
            <img
              src={logo}
              alt="Buy Minute Logo"
              className="w-12 rounded-xl h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain transition-transform duration-300 hover:scale-105"
            />
            <figcaption className="text-gray-900 font-bold text-lg md:text-xl lg:text-2xl text-center">
              Buy Minute
            </figcaption>
          </figure>
          <p className="text-gray-500 text-sm text-center sm:text-left mt-2">
            Your one-stop shop for quality products at the best prices.
          </p>
        </section>

        {/* Quick Links */}
        <section className="flex flex-col gap-2">
          <h2 className="text-gray-900 font-semibold text-lg mb-2">Quick Links</h2>
          <NavLink className={navLinkClass} to="/home" aria-label="Home">
            Home
          </NavLink>
          <NavLink className={navLinkClass} to="/shop" aria-label="Shop">
            Shop
          </NavLink>
          <NavLink className={navLinkClass} to="/about" aria-label="About">
            About
          </NavLink>
          <NavLink className={navLinkClass} to="/contact" aria-label="Contact">
            Contact
          </NavLink>
        </section>

        {/* Customer Links */}
        <section className="flex flex-col gap-2">
          <h2 className="text-gray-900 font-semibold text-lg mb-2">Customer Links</h2>
          <NavLink className={navLinkClass} to="/account" aria-label="Account">
            Account
          </NavLink>
          <NavLink className={navLinkClass} to="/orders" aria-label="Orders">
            Orders
          </NavLink>
          <NavLink className={navLinkClass} to="/cart" aria-label="Cart">
            Cart
          </NavLink>
          <NavLink className={navLinkClass} to="/login" aria-label="Login">
            Login
          </NavLink>
        </section>

        {/* Contact Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-gray-900 font-semibold text-lg mb-2">Contact</h2>
          <a
            href="mailto:support@buyminstore.com"
            className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
            aria-label="Email Support"
          >
            📧 support@buyminstore.com
          </a>
          <a
            href="tel:+251909040610"
            className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
            aria-label="Call Support"
          >
            📞 0909040610
          </a>
          <div className="flex gap-4 mt-2">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
              aria-label="Telegram"
            >
              Telegram
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
              aria-label="Instagram"
            >
              Instagram
            </a>
          </div>
        </section>
      </div>

      {/* Bottom Footer */}
      <div className="mt-10 border-t border-gray-200 text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Buy Minute. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
