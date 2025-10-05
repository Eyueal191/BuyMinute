import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RootLayout() {
  return (
    <div>
      <Outlet />
      <ToastContainer />
    </div>
  );
}

export default RootLayout;
