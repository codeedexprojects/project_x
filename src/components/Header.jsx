"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Players", path: "/players" },
    { name: "Tournaments", path: "/tournaments" },
    { name: "Clubs", path: "/clubs" },
    { name: "Ranking", path: "/rankings" },
    { name: "Umpire", path: "/umpire" },
  ];

  const isActive = (p) => pathname === p;

  const goTo = (path) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#000] backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => goTo("/")}>
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-white text-xl font-semibold">ShuttleDesk BQAB</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => goTo(link.path)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-300
                text-white
                ${
                  isActive(link.path)
                    ? "bg-[linear-gradient(180deg,rgba(16,16,16,0)_51.11%,rgba(23,5,124,0.8)_100%)] backdrop-blur-md"
                    : "hover:bg-white/10"
                }
              `}
            >
              {link.name}
            </button>
          ))}

          {/* Login button */}
          <button
            onClick={() => goTo("/login")}
            className="ml-3 px-6 py-2 rounded-md text-white font-medium 
            bg-[linear-gradient(277.59deg,#17057C_-12.13%,#000000_115.41%)]
            hover:opacity-90 transition"
          >
            Login
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a]/90 backdrop-blur-md border-t border-white/10 p-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => goTo(link.path)}
              className={`block w-full text-left px-4 py-2 rounded-md text-white
                ${
                  isActive(link.path)
                    ? "bg-[linear-gradient(180deg,rgba(16,16,16,0)_51.11%,rgba(23,5,124,0.8)_100%)] backdrop-blur-md"
                    : "hover:bg-white/10"
                }
              `}
            >
              {link.name}
            </button>
          ))}

          <button
            onClick={() => goTo("/login")}
            className="block w-full text-left px-4 py-2 rounded-md text-white 
            bg-[linear-gradient(277.59deg,#17057C_-12.13%,#000000_115.41%)]"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
}
