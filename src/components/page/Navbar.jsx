import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Menu, X, User, LogOut, ChevronDown, PlusCircle } from "lucide-react";

function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const profileBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isProfileOpen &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");
    if (token && userCookie) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userCookie));
      } catch (_) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-emerald-600 sticky top-0 z-50 shadow-md text-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-emerald-600"
        >
          <div className="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
            P
          </div>
          <span className="hidden sm:inline text-white">Polytechub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/create"
            className="flex items-center gap-1 text-white font-medium hover:text-emerald-50 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Add Todo
          </Link>

          {isLoggedIn && (
            <div className="relative" ref={profileBtnRef}>
              <button
                onClick={() => setIsProfileOpen((p) => !p)}
                className="flex items-center gap-2"
              >
                <User className="bg-emerald-100 text-emerald-600 rounded-full p-1 w-8 h-8" />
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isProfileOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-lg shadow-xl bg-white text-gray-800 ring-1 ring-black/5 py-2 animate-scale-in origin-top-right">
                  {user && (
                    <div className="px-4 py-2 border-b text-sm">
                      <p className="text-base capitalize font-semibold truncate">
                        {user.fullname?.toLowerCase() || user.username}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-rose-600 font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileOpen((p) => !p)}
          className="md:hidden text-emerald-50"
        >
          {isMobileOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7 text-white" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white shadow-inner text-gray-800">
          <div className="space-y-1 px-4 pt-2 pb-4">
            <Link
              to="/create"
              onClick={() => setIsMobileOpen(false)}
              className="block py-2 rounded-md hover:bg-emerald-100"
            >
              <div className="flex items-center gap-1">
                <PlusCircle className="w-5 h-5 text-emerald-600" /> Add Todo
              </div>
            </Link>

            {isLoggedIn && (
              <>
                <button
                  onClick={() => setIsProfileOpen((p) => !p)}
                  className="w-full flex items-center gap-1 py-2 rounded-md hover:bg-emerald-100"
                >
                  <User className="w-5 h-5 text-emerald-600" /> Profile
                </button>

                {isProfileOpen && (
                  <div className="pl-6 space-y-1">
                    {user && (
                      <div className="text-sm py-1 border-b border-gray-200 text-gray-600">
                        {user.name || user.username || user.email}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileOpen(false);
                      }}
                      className="flex items-center gap-1 py-2 text-rose-500 hover:text-rose-700"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

// Tailwind keyframes (optional animation)
// .animate-scale-in { @apply transform transition duration-150 ease-out scale-95 opacity-0; animation: scale-in 150ms forwards; }
// @keyframes scale-in { to { transform: scale(1); opacity: 1); } }
