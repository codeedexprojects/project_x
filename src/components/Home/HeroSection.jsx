import React from "react";
import { Users, Trophy, Building2, UserCheck } from "lucide-react";

export default function ShuttleDeskHome() {
  const stats = [
    { icon: Users, value: "54321", label: "Players" },
    { icon: Trophy, value: "85", label: "Tournaments" },
    { icon: Building2, value: "423", label: "Clubs" },
    { icon: UserCheck, value: "456", label: "Umpire" },
  ];

  return (
    <div className=" bg-black text-white flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-3 relative overflow-hidden">
      {/* Left Content */}
      <div className="z-10 max-w-lg space-y-4 text-center lg:text-left">
        {/* Title Section */}
        <div>
          <p className="text-gray-300 text-lg mb-2">Welcome to</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            ShuttleDesk <span className="text-purple-400">BQAB</span>
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-5 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-[#4b0082]/80 to-[#2e0057]/80 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <stat.icon className="w-8 h-8 mb-3 text-white" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-gray-300 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Image */}
      <div className="relative z-10 w-full lg:w-[85%] flex justify-end">
        <img
          src="/Hero.png"
          alt="Badminton Player"
          className="w-full max-w-[950px] object-cover lg:object-contain"
        />
      </div>

      {/* Optional Background Glow */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-purple-700/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-900/30 rounded-full blur-3xl"></div>
    </div>
  );
}
