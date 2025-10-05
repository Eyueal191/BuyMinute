import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
function AccountLayout() {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };
  const linkClass = ({ isActive }) =>
    `p-3 border-b border-gray-300 transition hover:bg-gray-100 ${
      isActive ? "bg-gray-200 font-semibold" : ""
    }`;
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="w-1/5 flex flex-col border-r border-gray-300 bg-white shadow-sm">
        <NavLink to="/account/profile" className={linkClass}>
          👤 Profile
        </NavLink>
        <NavLink to="/account/security" className={linkClass}>
          🔒 Security
        </NavLink>
        <button
          onClick={logOut}
          className="mt-auto m-3 p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Log Out
        </button>
      </nav>
      {/* Main Content */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}
export default AccountLayout;
