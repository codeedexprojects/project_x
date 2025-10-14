import React from 'react';
import { Users, Trophy, Building2 } from 'lucide-react';

export default function HeroSection() {
  const stats = [
    { icon: Users, count: '1769', label: 'Players' },
    { icon: Trophy, count: '40', label: 'Tournaments' },
    { icon: Building2, count: '48', label: 'Clubs' },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <main className="container mx-auto px-4 py-16">
        {/* Logo and Title */}
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="mb-8">
            <img
              src="/logo.png" 
              alt="ShuttleDesk Logo"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>

          <div className="text-center space-y-3">
            <p className="text-gray-400 text-lg md:text-xl">Welcome to</p>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white tracking-tight">
              ShuttleDesk BQAB
            </h2>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-8 md:p-10 hover:from-zinc-700 hover:to-zinc-800 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-900/20 cursor-pointer"
              >
                <div className="flex flex-col items-center space-y-4">
                  <IconComponent
                    className="w-14 h-14 md:w-16 md:h-16 text-red-500"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-5xl md:text-6xl font-bold text-white">{stat.count}</h3>
                  <p className="text-lg md:text-xl text-gray-300 font-medium">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
