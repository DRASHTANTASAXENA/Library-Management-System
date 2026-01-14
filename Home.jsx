import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check if we are on the Home page
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine background color
  const navBg = isHomePage 
    ? (isScrolled ? "bg-gray-900/90 backdrop-blur-md shadow-lg" : "bg-transparent") 
    : "bg-white border-b border-gray-100"; // Solid for all other pages

  const textColor = isHomePage && !isScrolled ? "text-white" : "text-gray-900";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-black tracking-tighter uppercase italic ${textColor}`}>
          LIB<span className="text-blue-600">SYS</span>
        </Link>
        
        <div className="flex gap-8 items-center">
          <Link to="/login" className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>Login</Link>
          <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl">Join</Link>
        </div>
      </div>
    </nav>
  );
}