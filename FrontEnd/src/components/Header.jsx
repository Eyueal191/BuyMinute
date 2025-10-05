import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { ShoppingCart, Package } from "lucide-react"; // Removed Search
import { SquareMenu } from 'lucide-react';
import { useSelector } from "react-redux";
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("loggedIn")
  const navigate = useNavigate();
  const [focusIndex, setFocusIndex] = useState(0);
  const cartItems = useSelector(state => state.userCart.userCart.items || []);
  const navItems = [
    "Home",
    "About",
    "Contact",
    "Shop",
    "Order",
    "Cart",
    "Login",
    "Account",
  ];
  const navRef = useRef({
    Home: null,
    About: null,
    Contact: null,
    Shop: null,
    Order: null,
    Cart: null,
    Login: null,
    Account: null,
  });

  const keyDownHandler = (e) => {
    const key = e.key;

    if (key === "ArrowUp" || key === "ArrowLeft") {
      if (focusIndex === 0) {
        setFocusIndex(navItems.length - 1);
      } else {
        setFocusIndex((prev) => prev - 1);
      }
    }

    if (key === "ArrowDown" || key === "ArrowRight") {
      if (focusIndex === navItems.length - 1) {
        setFocusIndex(0);
      } else {
        setFocusIndex((prev) => prev + 1);
      }
    }
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "py-2 px-4 text-black font-semibold border-b border-gray-500"
      : "py-2 px-4 text-gray-500 hover:text-blue-600 transition-colors border-b border-gray-500";

  useEffect(() => {
    const focusLink = navItems[focusIndex];
    const element = navRef.current[focusLink];
    if (element) {
      element.focus();
    }
  }, [focusIndex]);

  return (
    <div className="w-full min-h-[12vh] flex flex-col border-b border-gray-200 bg-gray-100 border-black py-6">
      <div className="w-full flex justify-around items-center px-4">
        {/* Hamburger */}
        <div className="w-2/6 flex item-center space-x-4">
              <button className="lg:hidden" onClick={toggleMenu}>
          <SquareMenu  size={58}/>
        </button>

        {/* Logo */}
        <figure
          className="w-1/6 flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
         <img
  src={logo}
  alt="logo"
  className="w-16 h-12 rounded transition-transform duration-300"
/>

        </figure>
        </div>
    

        {/* Desktop Nav */}
        <nav className="hidden w-2/6 lg:flex justify-around items-center">
          <NavLink
            to="/"
            className="py-1 px-2 text-gray-500 hover:text-blue-600 hover:underline transition-colors"
            ref={(el) => (navRef.current["Home"] = el)}
            data-name="Home"
            onKeyDown={keyDownHandler}
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className="py-1 px-2 text-gray-500 hover:text-blue-600 hover:underline transition-colors"
            ref={(el) => (navRef.current["Shop"] = el)}
            data-name="Shop"
            onKeyDown={keyDownHandler}
          >
            Shop
          </NavLink>
          <NavLink
            to="/about"
            className="py-1 px-2 text-gray-500 hover:text-blue-600 hover:underline transition-colors"
            ref={(el) => (navRef.current["About"] = el)}
            data-name="About"
            onKeyDown={keyDownHandler}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="py-1 px-2 text-gray-500 hover:text-blue-600 hover:underline transition-colors"
            data-name="Contact"
            ref={(el) => (navRef.current["Contact"] = el)}
            onKeyDown={keyDownHandler}
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Icons */}
        <nav className="w-2/6 flex flex-row md:flex-col lg:flex-row justify-around items-center gap-2">
          <NavLink
            to="/orders"
            className="hidden lg:flex items-center gap-1 py-1 px-2 text-gray-500 hover:text-blue-600 hover:underline transition-colors"
            data-name="Order"
            ref={(el) => (navRef.current["Order"] = el)}
            onKeyDown={keyDownHandler}
          >
            <span>Orders</span> <Package size={20} />
          </NavLink>

          <NavLink
            to="/cart"
            data-name="Cart"
            className="relative flex items-center gap-1 py-1 px-2 text-gray-500 hover:text-blue-600 hover:underline transition-colors"
            ref={(el) => (navRef.current["Cart"] = el)}
            onKeyDown={keyDownHandler}
          >
            <span>Cart</span> <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 text-xs w-5 h-5 flex items-center justify-center rounded-full text-white bg-red-500">
              {cartItems.length}
            </span>
          </NavLink>

          {isLoggedIn ? (
            <NavLink
              to="/account"
              data-name="Account"
              className="py-1 px-2 text-gray-500 hover:text-blue-600 hover:underline transition-colors"
              ref={(el) => (navRef.current["Account"] = el)}
              onKeyDown={keyDownHandler}
            >
              Account
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              data-name="Login"
              className="py-1 px-2 text-gray-500 hover:text-blue-600 hover:underline transition-colors"
              ref={(el) => (navRef.current["Login"] = el)}
              onKeyDown={keyDownHandler}
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="w-2/3 flex flex-col lg:hidden border-t border-r bg-white mt-6">
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={toggleMenu}
            data-name="Home"
            ref={(el) => (navRef.current["Home"] = el)}
            onKeyDown={keyDownHandler}
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={navLinkClass}
            onClick={toggleMenu}
            data-name="Shop"
            ref={(el) => (navRef.current["Shop"] = el)}
            onKeyDown={keyDownHandler}
          >
            Shop
          </NavLink>
          <NavLink
            to="/about"
            className={navLinkClass}
            onClick={toggleMenu}
            data-name="About"
            ref={(el) => (navRef.current["About"] = el)}
            onKeyDown={keyDownHandler}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={navLinkClass}
            onClick={toggleMenu}
            data-name="Contact"
            ref={(el) => (navRef.current["Contact"] = el)}
            onKeyDown={keyDownHandler}
          >
            Contact
          </NavLink>
          <NavLink
            to="/orders"
            className={navLinkClass}
            onClick={toggleMenu}
            data-name="Order"
            ref={(el) => (navRef.current["Order"] = el)}
            onKeyDown={keyDownHandler}
          >
            Orders
          </NavLink>
          <NavLink
            to="/cart"
            className={navLinkClass}
            onClick={toggleMenu}
            data-name="Cart"
            ref={(el) => (navRef.current["Cart"] = el)}
            onKeyDown={keyDownHandler}
          >
            Cart
          </NavLink>
          {isLoggedIn ? (
            <NavLink
              to="/account"
              className={navLinkClass}
              onClick={toggleMenu}
              data-name="Account"
              ref={(el) => (navRef.current["Account"] = el)}
              onKeyDown={keyDownHandler}
            >
              Account
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={navLinkClass}
              onClick={toggleMenu}
              data-name="Login"
              ref={(el) => (navRef.current["Login"] = el)}
              onKeyDown={keyDownHandler}
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}
export default Header;
