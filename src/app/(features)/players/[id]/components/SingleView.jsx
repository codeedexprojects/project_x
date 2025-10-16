"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "@/redux/slice/playersSlice";
import { useParams, useRouter } from "next/navigation";

export default function PlayerDetails() {
  const [filterCategory, setFilterCategory] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  const { singleUser, loading, error } = useSelector(
    (state) => state.playerSlice
  );

  useEffect(() => {
    if (id) dispatch(getUserById(id));
  }, [dispatch, id]);

  const user = singleUser?.user || {};
  const summary = singleUser?.summary || {};
  const tournamentParticipation = singleUser?.tournamentParticipation || [];

  const playerInfo = {
    name: user.name || "-",
    qid: user.qid || "-",
    club: user.club_name || "-",
    country: user.country || "-",
    level: user.level || "-",
    dob: user.dob || "-",
    gender: user.gender || "-",
    contact: user.contact || "-",
    totalPoints: summary.totalPoints || 0,
    totalTournaments: summary.totalTournaments || 0,
  };

  // Flatten participation data
  const tournamentHistory = tournamentParticipation.flatMap((tp) =>
    tp.participations.map((p) => ({
      tournament: tp.tournament.name,
      date: new Date(tp.tournament.date).toLocaleDateString(),
      category: p.category?.name,
      position: p.position,
      points: p.pointsEarned,
    }))
  );

  const categories = [
    ...new Set(tournamentHistory.map((item) => item.category)),
  ];

  const filteredHistory = filterCategory
    ? tournamentHistory.filter((t) => t.category === filterCategory)
    : tournamentHistory;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">BACK</span>
        </button>

        {loading ? (
          <p className="text-gray-400 text-center">Loading player details...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {/* Player Info */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-8 mb-6 border border-zinc-700/50">
              <div className="flex justify-between items-start mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {playerInfo.name}
                </h1>
                <div className="flex gap-3">
                  <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200">
                    <Pencil size={20} />
                  </button>
                  <button className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    QID: <span className="text-white">{playerInfo.qid}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    DOB: <span className="text-white">{playerInfo.dob}</span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    Club: <span className="text-white">{playerInfo.club}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Gender: <span className="text-white">{playerInfo.gender}</span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    Country: <span className="text-white">{playerInfo.country}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Contact: <span className="text-white">{playerInfo.contact}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 text-gray-400 text-sm">
                <p>
                  Total Points:{" "}
                  <span className="text-white font-semibold">
                    {playerInfo.totalPoints}
                  </span>
                </p>
                <p>
                  Total Tournaments:{" "}
                  <span className="text-white font-semibold">
                    {playerInfo.totalTournaments}
                  </span>
                </p>
              </div>
            </div>

            {/* Tournament History */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-8 border border-zinc-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Tournament History</h2>
                <div className="relative w-64">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full bg-zinc-700 text-gray-300 px-4 py-2 pr-10 rounded-lg border border-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Filter by Category</option>
                    {categories.map((category, i) => (
                      <option key={i} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="py-3 px-4 text-left text-gray-300">Tournament</th>
                      <th className="py-3 px-4 text-left text-gray-300">Date</th>
                      <th className="py-3 px-4 text-left text-gray-300">Category</th>
                      <th className="py-3 px-4 text-left text-gray-300">Position</th>
                      <th className="py-3 px-4 text-left text-gray-300">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((record, i) => (
                        <tr key={i} className="border-b border-zinc-700/50 hover:bg-zinc-700/20">
                          <td className="py-3 px-4 text-gray-200">{record.tournament}</td>
                          <td className="py-3 px-4 text-gray-300">{record.date}</td>
                          <td className="py-3 px-4 text-gray-300">{record.category}</td>
                          <td className="py-3 px-4 text-gray-300">{record.position}</td>
                          <td className="py-3 px-4 text-gray-200 font-semibold">
                            {record.points}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-gray-500 py-6">
                          No tournament records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
