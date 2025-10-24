import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaFacebookSquare, FaInstagramSquare, FaTelegramPlane } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

function Footer() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkClasses = (path) =>
    `inline-flex items-center transition-all duration-300 rounded-full px-4 py-2 w-full ${
      isActive(path)
        ? "bg-white text-blue-600 font-semibold shadow-md"
        : "text-white hover:bg-white hover:text-blue-600 hover:shadow-md"
    }`;

  const contactLinkClasses =
    "inline-flex items-center gap-2 text-white transition-all duration-300 rounded-full px-4 py-2 w-full hover:bg-white hover:text-blue-600 hover:shadow-md";

  return (
    <footer className="bg-gradient-to-t from-gray-800 to-gray-900 w-full py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

        {/* Brand Section */}
        <section className="flex flex-col items-start space-y-4">
          <figure
            className="flex flex-col items-start cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={logo}
              alt="Buy Minute Logo"
              className="w-24 h-14 object-cover rounded-xl border border-gray-300 transition-transform duration-300 hover:scale-105 shadow-md"
            />
            <figcaption className="flex mt-2 items-center gap-3">
              <span className="font-bold text-2xl text-white">
                Buy <span className="text-white/70">Minute</span>
              </span>
              <span className="block w-20 h-1 bg-white/50 rounded-xl"></span>
            </figcaption>
          </figure>
          <p className="text-white/90 text-sm leading-relaxed">
            Your one-stop shop for quality products at unbeatable prices.
          </p>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-white font-semibold text-xl mb-3">Quick Links</h2>
          <ul className="flex flex-col gap-2">
            {[
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={navLinkClasses(link.path)}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>

        {/* Customer Links */}
        <section>
          <h2 className="text-white font-semibold text-xl mb-3">Customer Links</h2>
          <ul className="flex flex-col gap-2">
            {[
              { name: "Account", path: "/account" },
              { name: "Orders", path: "/orders" },
              { name: "Cart", path: "/cart" },
              { name: "Login", path: "/login" },
            ].map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={navLinkClasses(link.path)}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact Section */}
        <section className="flex flex-col space-y-3 items-start">
          <h2 className="text-white font-semibold text-xl mb-2">Contact</h2>
          <a href="mailto:support@buyminstore.com" className={contactLinkClasses}>
            <MdEmail className="text-lg" /> support@buyminstore.com
          </a>
          <a href="tel:+251909040610" className={contactLinkClasses}>
            <MdPhone className="text-lg" /> 0909040610
          </a>

          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { icon: <FaTelegramPlane />, name: "Telegram", href: "#" },
              { icon: <FaFacebookSquare />, name: "Facebook", href: "#" },
              { icon: <FaInstagramSquare />, name: "Instagram", href: "#" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                className={contactLinkClasses}
                aria-label={social.name}
              >
                {social.icon} {social.name}
              </a>
            ))}
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
