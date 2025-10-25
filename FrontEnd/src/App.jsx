import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import Axios from "./axios/axios.config.js";
import { toast } from "react-hot-toast";
import { setUserCart } from "./redux/cartSlice.js";

// Pages
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Shop from "./pages/Shop.jsx";
import Orders from "./pages/Orders.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import LogIn from "./pages/LogIn.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import VerifyEmailOTP from "./pages/VerifyEmailOTP.jsx";
import VerifyResetPasswordOTP from "./pages/VerifyPasswordResetOTP.jsx";
import SignUp from "./pages/SignUp.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Profile from "./pages/account/Profile.jsx";
import Security from "./pages/account/Security.jsx";
import AccountLayout from "./pages/account/AccountLayout.jsx";
import RootLayout from "./pages/layouts/RootLayOut.jsx";
// API actions
import {
  signUpAction,
  verifyEmailOtpAction,
  verifyPasswordResetOtpAction,
  forgotPasswordAction,
  passwordResetAction,
} from "./api/actions.js";

function App() {
  const dispatch = useDispatch();
  // Protected route wrapper
  const RequireAuth = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(
      !!localStorage.getItem("accessToken") &&
        !!localStorage.getItem("userId") &&
        !!localStorage.getItem("email")
    );

    useEffect(() => {
      const handleStorageChange = () => {
        setLoggedIn(
          !!localStorage.getItem("accessToken") &&
            !!localStorage.getItem("userId") &&
            !!localStorage.getItem("email")
        );
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    if (!loggedIn) return <Navigate to="/login" replace />;
    return children;
  };
  // Fetch user cart on app mount.
  useEffect(() => {
    const fetchUserCart = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await Axios.get(`/api/cart/${userId}`);
        const data = response.data;

        if (data.success) {
          dispatch(setUserCart(data.userCart || { user: userId, items: [] }));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch UserCart");
      }
    };
    fetchUserCart();
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<RootLayout />} errorElement={<ErrorPage />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} action={signUpAction} />
        <Route path="/verify-email-otp" element={<VerifyEmailOTP />} action={verifyEmailOtpAction} />
        <Route path="/verify-password-otp" element={<VerifyResetPasswordOTP />} action={verifyPasswordResetOtpAction} />
        <Route path="/forgot-password" element={<ForgotPassword />} action={forgotPasswordAction} />
        <Route path="/password-reset" element={<PasswordReset />} action={passwordResetAction} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        {/* Protected Routes */}
        <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
        <Route path="/place-order" element={<RequireAuth><PlaceOrder /></RequireAuth>} />
        {/* Nested Account Routes */}
        <Route path="/account" element={<RequireAuth><AccountLayout /></RequireAuth>}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="security" element={<Security />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
