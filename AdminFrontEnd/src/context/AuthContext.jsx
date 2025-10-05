import React, { createContext, useState, useEffect } from "react";

// Create the Auth context
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [email, setEmail] = useState(localStorage.getItem("email"));

  // Login function
  const logIn = (email, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setAccessToken(accessToken);
    setIsLoggedIn(true);
  };

  // Logout function
  const logOut = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setIsLoggedIn(false);
  };
  // singUp function
  const signUp = (email) => {
    localStorage.setItem("email", email);
    setEmail(email);
  };
  // Sync the context state with localStorage on initial load
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedEmail && storedAccessToken) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
      setAccessToken(storedAccessToken);
    }
  }, []);
  const value = { isLoggedIn, email, setEmail, signUp, logIn, logOut, accessToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
