import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { ShoppingCart, Package, SquareMenu } from "lucide-react";
import { useSelector } from "react-redux";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("loggedIn");
  const navigate = useNavigate();
  const [focusIndex, setFocusIndex] = useState(0);
  const cartItems = useSelector((state) => state.userCart.userCart.items || []);

  const navRef = useRef({
    Home: null,
    About: null,
    Contact: null,
    Shop: null,
    Order: null,
    Cart: null,
    "Log In": null,
    Account: null,
  });

  const keyDownHandler = (e) => {
    const navItems = ["Home", "About", "Contact", "Shop", "Order", "Cart", isLoggedIn ? "Account" : "Log In"];
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") setFocusIndex(focusIndex === 0 ? navItems.length - 1 : focusIndex - 1);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") setFocusIndex(focusIndex === navItems.length - 1 ? 0 : focusIndex + 1);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "py-2 px-4 text-white font-semibold border-b-2 border-blue-400 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      : "py-2 px-4 text-white hover:text-blue-400 hover:bg-gray-700 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2";

  useEffect(() => {
    const navItems = ["Home", "About", "Contact", "Shop", "Order", "Cart", isLoggedIn ? "Account" : "Log In"];
    const element = navRef.current[navItems[focusIndex]];
    if (element) element.focus();
  }, [focusIndex, isLoggedIn]);

  return (
    <header className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 lg:px-12 py-4 lg:py-6">
        {/* Logo + Hamburger */}
        <div className="flex items-center space-x-4 w-2/6">
          <button className="lg:hidden text-white hover:text-blue-400 transition-colors" onClick={toggleMenu}>
            <SquareMenu size={32} />
          </button>
          <figure className="cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" className="w-24 h-14 rounded-lg transition-transform duration-300 hover:scale-105 shadow-sm" />
          </figure>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex justify-center space-x-6 w-2/6">
          <NavLink to="/" className={navLinkClass} ref={(el) => (navRef.current["Home"] = el)} onKeyDown={keyDownHandler}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass} ref={(el) => (navRef.current["About"] = el)} onKeyDown={keyDownHandler}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass} ref={(el) => (navRef.current["Contact"] = el)} onKeyDown={keyDownHandler}>
            Contact
          </NavLink>
          <NavLink to="/shop" className={navLinkClass} ref={(el) => (navRef.current["Shop"] = el)} onKeyDown={keyDownHandler}>
            Shop
          </NavLink>
        </nav>

        {/* Right Icons */}
        <nav className="flex items-center justify-end w-2/6 space-x-4 lg:space-x-6">
          <NavLink
            to="/orders"
            className="hidden lg:flex items-center gap-1 text-white hover:text-blue-400 transition-all rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            ref={(el) => (navRef.current["Order"] = el)}
            onKeyDown={keyDownHandler}
          >
            Orders <Package size={20} />
          </NavLink>

          <NavLink
            to="/cart"
            className="relative flex items-center gap-1 text-white hover:text-blue-400 transition-all rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            ref={(el) => (navRef.current["Cart"] = el)}
            onKeyDown={keyDownHandler}
          >
            Cart <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white font-semibold">
                {cartItems.length}
              </span>
            )}
          </NavLink>

          {isLoggedIn ? (
            <NavLink
              to="/account"
              className="text-white hover:text-blue-400 transition-all rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              ref={(el) => (navRef.current["Account"] = el)}
              onKeyDown={keyDownHandler}
            >
              Account
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="text-white hover:text-blue-400 transition-all rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              ref={(el) => (navRef.current["Log In"] = el)}
              onKeyDown={keyDownHandler}
            >
              Log In
            </NavLink>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden w-full mt-2 py-4 flex flex-col space-y-2 px-6 rounded-md shadow-md bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 border border-gray-700">
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={toggleMenu}
            ref={(el) => (navRef.current["Home"] = el)}
            onKeyDown={keyDownHandler}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={navLinkClass}
            onClick={toggleMenu}
            ref={(el) => (navRef.current["About"] = el)}
            onKeyDown={keyDownHandler}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={navLinkClass}
            onClick={toggleMenu}
            ref={(el) => (navRef.current["Contact"] = el)}
            onKeyDown={keyDownHandler}
          >
            Contact
          </NavLink>
          <NavLink
            to="/shop"
            className={navLinkClass}
            onClick={toggleMenu}
            ref={(el) => (navRef.current["Shop"] = el)}
            onKeyDown={keyDownHandler}
          >
            Shop
          </NavLink>
          <NavLink
            to="/orders"
            className={navLinkClass}
            onClick={toggleMenu}
            ref={(el) => (navRef.current["Order"] = el)}
            onKeyDown={keyDownHandler}
          >
            Orders
          </NavLink>
        </div>
      )}
    </header>
  );
}

export default Header;
