"use client";

import React, { useEffect } from "react";
import { Users, Trophy, Building2, UserCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "@/redux/slice/dashboardSlice";
import { K2D } from "next/font/google";

const k2d = K2D({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function ShuttleDeskHome() {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  const stats = [
    { icon: Users, value: dashboard?.data?.userCount ?? 0, label: "Players" },
    {
      icon: Trophy,
      value: dashboard?.data?.tournamentCount ?? 0,
      label: "Tournaments",
    },
    { icon: Building2, value: dashboard?.data?.clubCount ?? 0, label: "Clubs" },
    {
      icon: UserCheck,
      value: dashboard?.data?.umpireCount ?? 0,
      label: "Umpire",
    },
  ];

  return (
    <div
      className={`relative text-white px-6 lg:px-20 py-8 overflow-hidden ${k2d.className}`}
      style={{
        minHeight: "calc(100vh - 80px)",
      }}
    >
      <img
        src="/Hero3.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between h-full">
        <div className="max-w-lg space-y-8 flex-1 pt-2">
          <p className="text-gray-200 text-2xl sm:text-3xl font-medium">
            Welcome to
          </p>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white">
            ShuttleDesk BQAB
          </h1>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
                style={{
                  background:
                    "linear-gradient(244.35deg, #17057C 4.42%, #08001D 95.58%)",
                }}
              >
                <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-white" />
                <p className="text-2xl sm:text-3xl font-bold">
                  {loading ? "..." : stat.value}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}
