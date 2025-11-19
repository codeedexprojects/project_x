"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Players", path: "/players" },
    { name: "Tournaments", path: "/tournaments" },
    { name: "Clubs", path: "/clubs" },
    { name: "Rankings", path: "/rankings" },
    // { name: "Categories", path: "/categorylist" },
    { name: "Exports", path: "/exports" },
    { name: "Login", path: "/login" },
  ];

  const handleNavigate = (path) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-0 pl-4 sm:pl-8">
            <img
              src="/logo.png"
              alt="ShuttleDesk Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center flex-wrap gap-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigate(link.path)}
                className={`px-5 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  link.name === "Login"
                    ? "text-white bg-gradient-to-r from-[#240083] to-[#08001D] hover:opacity-90"
                    : isActive(link.path)
                    ? "text-white bg-[#1e0066] shadow-lg"
                    : "text-black hover:text-white hover:bg-[#1e0066]"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-black p-2 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  setActiveLink(link.name);
                  handleNavigate(link.path);
                }}
                className={`block w-full text-left px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  link.name === "Login"
                    ? "text-white bg-gradient-to-r from-[#240083] to-[#08001D] hover:opacity-90"
                    : activeLink === link.name
                    ? "text-white bg-[#1e0066] shadow-lg"
                    : "text-gray-800 hover:text-white hover:bg-[#1e0066]"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom Accent Line */}
      <div className="h-1 bg-[#1e0066]"></div>
    </header>
  );
}
