import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiLogOut } from "react-icons/fi";

function AccountLayout() {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 w-full px-5 py-3 text-gray-700 text-base font-medium rounded-lg transition-all duration-200 
     ${isActive ? "bg-blue-100 text-blue-700 font-semibold ring-2 ring-blue-400" : "hover:bg-gray-100"}
    `;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="w-64 flex flex-col border-r border-gray-200 bg-white shadow-sm p-6 pt-15">
        <div className="flex flex-col gap-2 w-full">
          <NavLink to="/account/profile" className={linkClass} end>
            <FiUser size={20} /> Profile
          </NavLink>
          <NavLink to="/account/security" className={linkClass}>
            <FiLock size={20} /> Security
          </NavLink>
        </div>

        <button
          onClick={logOut}
          className="mt-auto flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <FiLogOut size={20} /> Log Out
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-10 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AccountLayout;
