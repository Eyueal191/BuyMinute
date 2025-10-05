import React, { Suspense, lazy, useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
// Layouts & Error.
import RootLayout from "./pages/layout/RootLayout.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
// Lazy-loaded pages.
const ProductList = lazy(() => import("./pages/ProductList.jsx"));
const Upload = lazy(() => import("./pages/Upload.jsx"));
const OrderList = lazy(() => import("./pages/OrderList.jsx"));
const ProductUpdate = lazy(() => import("./pages/ProductUpdate.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const LogIn = lazy(() => import("./pages/LogIn.jsx"));
const VerifyPasswordResetOTP = lazy(() => import("./pages/VerifyPasswordResetOTP.jsx"));
const PasswordReset = lazy(() => import("./pages/PasswordReset.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const DashBoardLayOut = lazy(() => import("./pages/layout/DashBoardLayOut.jsx"));
// Loader fallback.
const Loader = () => <p className="text-description secondary-accent-text">Loading...</p>;
const RequireAuth = ({ children }) => {
const { isLoggedIn } = useContext(AuthContext);
  // If not logged in, redirect to /login.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // If logged in, render the children.
  return children;
};
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<RootLayout />} errorElement={<ErrorPage />}>
        {/* -------- Public Routes -------- */}
        <Route path="/login" element={<Suspense fallback={<Loader />}><LogIn /></Suspense>} />
        <Route path="/forgot-password" element={<Suspense fallback={<Loader />}><ForgotPassword /></Suspense>} />
        <Route path="/verify-password-otp" element={<Suspense fallback={<Loader />}><VerifyPasswordResetOTP /></Suspense>} />
        <Route path="/password-reset" element={<Suspense fallback={<Loader />}><PasswordReset /></Suspense>} />
        {/* -------- Protected Routes -------- */}
        <Route element={<RequireAuth><Suspense fallback={<Loader />}><DashBoardLayOut /></Suspense></RequireAuth>}>
          <Route index element={<ProductList />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="upload" element={<Upload />} />
          <Route path="order-list" element={<OrderList />} />
          <Route path="product-update/:id" element={<ProductUpdate />} />
          <Route path="product-detail/:id" element={<ProductDetails />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}
export default App;
