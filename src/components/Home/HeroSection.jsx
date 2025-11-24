"use client"

import React, { useEffect } from "react";
import { Users, Trophy, Building2, UserCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "@/redux/slice/dashboardSlice";

export default function ShuttleDeskHome() {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  const stats = [
    { icon: Users, value: dashboard?.data?.userCount ?? 0, label: "Players" },
    { icon: Trophy, value: dashboard?.data?.tournamentCount ?? 0, label: "Tournaments" },
    { icon: Building2, value: dashboard?.data?.clubCount ?? 0, label: "Clubs" },
    { icon: UserCheck, value: dashboard?.data?.umpireCount ?? 0, label: "Umpire" },
  ];

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-between px-6 lg:px-20 py-8 relative overflow-hidden">

      {/* Left Content */}
      <div className="z-10 max-w-lg space-y-8 flex-1">

        {/* Title Section */}
        <div className="space-y-3">
          <p className="text-gray-300 text-lg">Welcome to</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            ShuttleDesk <span className="text-purple-400">BQAB</span>
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-[#4b0082]/80 to-[#2e0057]/80 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-white" />
              <p className="text-2xl sm:text-3xl font-bold">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Right Image - Touching Bottom */}
      <div className="relative z-10 flex-1 flex justify-center lg:justify-end items-end self-stretch">
        <img
          src="/Hero.png"
          alt="Badminton Player"
          className="w-full max-w-[600px] lg:max-w-[800px] xl:max-w-[950px] object-contain h-auto self-end"
          style={{ height: 'calc(100vh - 64px)' }} // Adjust based on your padding
        />
      </div>

      {/* Background Glow Effects */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-purple-700/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-900/30 rounded-full blur-3xl"></div>
    </div>
  );
}