"use client";
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  const navLinks = ['Home', 'Players', 'Tournaments', 'Clubs', 'Rankings', 'Exports'];

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="ShuttleDesk Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                ShuttleDesk <span className="text-red-500">BQAB</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setActiveLink(link)}
                className={`px-6 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  activeLink === link
                    ? 'text-white bg-red-600 shadow-lg shadow-red-600/50'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => {
                  setActiveLink(link);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-6 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                  activeLink === link
                    ? 'text-white bg-red-600 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Active indicator line */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
    </header>
  );
}
