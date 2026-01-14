import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Logic to close dropdown when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setOpen(false);
    navigate("/login");
  };

  const isHomePage = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] px-8 py-4 flex justify-between items-center transition-all duration-300 ${
      isHomePage && !token 
        ? "bg-[#0f172a]/90 backdrop-blur-md" 
        : "bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm"
    }`}>
      
      {/* Logo Section */}
      <Link 
        to={token ? "/dashboard" : "/"} 
        className={`text-2xl font-black tracking-tighter flex items-center gap-2 ${
          isHomePage && !token ? "text-white" : "text-gray-900"
        }`}
      >
        <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-sm shadow-lg shadow-blue-500/30">LB</span>
        <span>Library<span className="text-blue-600">OS</span></span>
      </Link>

      {/* Account Section */}
      <div className="relative" ref={dropdownRef}>
        {token ? (
          <div className="flex items-center">
            <button
              onClick={() => setOpen(!open)}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
            >
              Account 
              <span className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {/* THE DROPDOWN FIX */}
            {open && (
              <div 
                className="absolute right-0 top-[120%] w-56 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden z-[999] p-2 animate-fade-in-up"
                style={{ transformOrigin: 'top right' }}
              >
                {/* Small indicator of user type */}
                <div className="px-4 py-2 mb-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Session Info</span>
                  <p className="text-[11px] font-bold text-blue-600 uppercase italic leading-none">{role}</p>
                </div>

                <Link 
                  to="/profile" 
                  className="block px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200" 
                  onClick={() => setOpen(false)}
                >
                  My Profile
                </Link>
                
                <Link 
                  to={role === "admin" ? "/admin/home" : "/user/home"} 
                  className="block px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200" 
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>

                <div className="h-px bg-gray-100 my-1 mx-2"></div>

                <button 
                  onClick={logout} 
                  className="w-full text-left px-4 py-3 text-sm font-black text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/login" className={`text-xs font-black uppercase tracking-widest ${isHomePage ? "text-white" : "text-gray-900"}`}>Login</Link>
            <Link to="/signup" className="px-6 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20">Join Now</Link>
          </div>
        )}
      </div>
    </nav>
  );
}