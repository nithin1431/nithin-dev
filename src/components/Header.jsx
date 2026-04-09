import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    theme,
    toggleTheme,
    role,
    setRole,
    isAuthenticated,
    logout,
  } = useContext(AppContext);

  return (
    <header
      className={`${
        theme === "dark"
          ? "bg-slate-900 text-white"
          : "bg-gray-300 text-black"
      }`}
    >
      <div className="container mx-auto flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-3">

        {/* Logo + Menu */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-blue-400 text-2xl">💻</span>
            <span className="text-xl font-bold">DevNithin</span>
          </div>

          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } flex-col w-full mt-3 p-3 rounded-lg bg-gray-200 z-50

          md:flex md:flex-row md:items-center md:gap-4
          md:bg-transparent md:p-0 md:mt-0 md:w-auto md:flex-nowrap`}
        >
          
          {/* Left Links */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/cards" onClick={() => setIsMenuOpen(false)}>Cards</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
          </div>

          {/* Right Controls */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border px-2 py-1 rounded mb-2 md:mb-0"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <button
              onClick={toggleTheme}
              className="bg-blue-500 text-white px-3 py-1 rounded whitespace-nowrap"
            >
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded whitespace-nowrap"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="bg-green-500 text-white px-3 py-1 rounded whitespace-nowrap text-center"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;