"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "@/redux/slice/adminAuth";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { logout: authLogout, admin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", matchType: "exact" },
    { name: "Players", path: "/players", matchType: "startsWith" },
    { name: "Tournaments", path: "/tournaments", matchType: "startsWith" },
    { name: "Clubs", path: "/clubs", matchType: "startsWith" },
    { name: "Ranking", path: "/rankings", matchType: "startsWith" },
    { name: "Umpire", path: "/umpire", matchType: "startsWith" },
  ];

  const isActive = (path, matchType = "startsWith") => {
    if (path === "/") {
      return pathname === "/";
    }
    
    if (matchType === "exact") {
      return pathname === path;
    }
    
    return pathname.startsWith(path);
  };

  const goTo = (path) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
    authLogout();
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleTokenExpired = () => {
      dispatch(logoutAdmin());
      authLogout();
    };

    window.addEventListener("tokenExpired", handleTokenExpired);
    return () => window.removeEventListener("tokenExpired", handleTokenExpired);
  }, [dispatch, authLogout]);

  return (
    <header className="w-full bg-[#000] backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => goTo("/")}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-white text-xl font-semibold">ShuttleDesk BQAB</h1>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => goTo(link.path)}
              className={`relative px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive(link.path, link.matchType)
                  ? "text-white relative after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-full after:bg-white before:absolute before:left-0 before:bottom-0 before:w-full before:h-full before:bg-[linear-gradient(0deg,rgba(23,5,124,0.8)_0%,rgba(16,16,16,0)_60%)] before:backdrop-blur-[4px] before:z-[-1]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {link.name}
            </button>
          ))}

          <div className="flex items-center gap-3 ml-3 pl-3 border-l border-white/20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-white 
              bg-[linear-gradient(277.59deg,#17057C_-12.13%,#000000_115.41%)]
              hover:opacity-90 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a]/90 backdrop-blur-md border-t border-white/10 p-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => goTo(link.path)}
              className={`block w-full text-left px-4 py-2 rounded-md text-white
                ${
                  isActive(link.path, link.matchType)
                    ? "bg-[linear-gradient(180deg,rgba(16,16,16,0)_51.11%,rgba(23,5,124,0.8)_100%)] backdrop-blur-md"
                    : "hover:bg-white/10"
                }
              `}
            >
              {link.name}
            </button>
          ))}

          <div className="pt-2 border-t border-white/20 space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-md text-white 
              bg-[linear-gradient(277.59deg,#17057C_-12.13%,#000000_115.41%)]
              hover:opacity-90 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}