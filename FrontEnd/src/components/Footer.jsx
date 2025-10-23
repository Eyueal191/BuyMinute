import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaFacebookSquare, FaInstagramSquare, FaTelegramPlane } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

function Footer() {
  const location = useLocation();
  const isRouteActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `inline-flex items-center justify-center transition-all duration-300 rounded-full px-4 py-2 ${
      isRouteActive(path)
        ? "bg-white text-blue-600 font-semibold shadow-md"
        : "text-white hover:bg-white hover:text-blue-600 hover:shadow-md"
    }`;

  const contactLinkClasses =
    "inline-flex items-center gap-2 text-white transition-all duration-300 rounded-full px-4 py-2 hover:bg-white hover:text-blue-600 hover:shadow-md";

  return (
    <footer className="bg-gradient-to-t from-gray-800 to-gray-900 w-full py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 items-start">

        {/* Brand Section */}
        <section className="flex flex-col items-start space-y-4">
          <figure
            className="flex flex-col items-start cursor-pointer group"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src={logo}
              alt="Buy Minute Logo"
              className="w-32 h-28 object-contain rounded-lg transition-transform duration-300 hover:scale-105 shadow-md"
            />
            <figcaption className="flex mt-2 items-center gap-3">
              <span className="font-bold text-2xl text-white">
                Buy <span className="text-white/70">Minute</span>
              </span>
              <span className="block w-20 h-1 bg-white/50 rounded-full"></span>
            </figcaption>
          </figure>

          <p className="text-white/90 text-sm leading-relaxed">
            Your one-stop shop for quality products at unbeatable prices.
          </p>
        </section>

        {/* Quick Links */}
        <section className="flex flex-col space-y-3">
          <h2 className="text-white font-semibold text-xl mb-2">Quick Links</h2>
          <NavLink to="/" className={linkClasses("/")}>Home</NavLink>
          <NavLink to="/shop" className={linkClasses("/shop")}>Shop</NavLink>
          <NavLink to="/about" className={linkClasses("/about")}>About</NavLink>
          <NavLink to="/contact" className={linkClasses("/contact")}>Contact</NavLink>
        </section>

        {/* Customer Links */}
        <section className="flex flex-col space-y-3">
          <h2 className="text-white font-semibold text-xl mb-2">Customer Links</h2>
          <NavLink to="/account" className={linkClasses("/account")}>Account</NavLink>
          <NavLink to="/orders" className={linkClasses("/orders")}>Orders</NavLink>
          <NavLink to="/cart" className={linkClasses("/cart")}>Cart</NavLink>
          <NavLink to="/login" className={linkClasses("/login")}>Login</NavLink>
        </section>

        {/* Contact Section */}
        <section className="flex flex-col space-y-3">
          <h2 className="text-white font-semibold text-xl mb-2">Contact</h2>
          <a href="mailto:support@buyminstore.com" className={contactLinkClasses}>
            <MdEmail className="text-lg" /> support@buyminstore.com
          </a>
          <a href="tel:+251909040610" className={contactLinkClasses}>
            <MdPhone className="text-lg" /> 0909040610
          </a>

          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#" className={contactLinkClasses}>
              <FaTelegramPlane className="text-lg" /> Telegram
            </a>
            <a href="#" className={contactLinkClasses}>
              <FaFacebookSquare className="text-lg" /> Facebook
            </a>
            <a href="#" className={contactLinkClasses}>
              <FaInstagramSquare className="text-lg" /> Instagram
            </a>
          </div>
        </section>
      </div>

      {/* Bottom Footer */}
      <div className="mt-12 text-center pt-6 text-white text-sm sm:text-base tracking-wide border-t border-gray-700">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-400">Buy Minute</span>. All rights reserved.
      </div>
    </footer>
  );
}
export default Footer;
