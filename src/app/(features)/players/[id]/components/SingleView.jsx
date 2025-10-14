"use client";
import React, { useState } from 'react';
import { ArrowLeft, Pencil, Trash2, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function PlayerDetails() {
  const [filterCategory, setFilterCategory] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const playerInfo = {
    name: 'Aadhira Satheesh Kumar',
    qid: '31535604340',
    club: 'SITHARA',
    country: 'INDIA',
    level: '',
    dob: '-',
    gender: '',
    contact: ''
  };

  const tournamentHistory = [
    {
      tournament: 'Fan4ever BQAB Qatar Open Tournament 2025 Season 2 In Association with Qatar Badminton Federation-QBF',
      date: '16 April 2025',
      category: 'U 11 Girls Singles',
      position: 'Pre-Quarter Final',
      points: '15'
    }
  ];

  const categories = ['U 11 Girls Singles', 'U 13 Girls Singles', 'U 15 Girls Singles'];

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">BACK</span>
        </button>

        {/* Player Info Card */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-8 mb-6 border border-zinc-700/50">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{playerInfo.name}</h1>
            <div className="flex gap-3">
              <button 
                className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200"
                aria-label="Edit"
              >
                <Pencil size={20} />
              </button>
              <button 
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200"
                aria-label="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">QID: <span className="text-white font-medium">{playerInfo.qid}</span></p>
              <p className="text-gray-400 text-sm">Date Of Birth: <span className="text-white">{playerInfo.dob}</span></p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Club: <span className="text-white">{playerInfo.club}</span></p>
              <p className="text-gray-400 text-sm">Gender: <span className="text-white">{playerInfo.gender}</span></p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Country: <span className="text-white">{playerInfo.country}</span></p>
              <p className="text-gray-400 text-sm">Contact: <span className="text-white">{playerInfo.contact}</span></p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Level: <span className="text-white">{playerInfo.level}</span></p>
            </div>
          </div>
        </div>

        {/* Tournament History */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-8 border border-zinc-700/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white">Tournament History</h2>
            <div className="relative w-full md:w-64">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-zinc-700 text-gray-300 px-4 py-2 pr-10 rounded-lg border border-zinc-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Filter by Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Tournament</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Position</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody>
                {tournamentHistory.map((record, index) => (
                  <tr key={index} className="border-b border-zinc-700/50 hover:bg-zinc-700/20 transition-colors">
                    <td className="py-4 px-4 text-gray-200 text-sm">{record.tournament}</td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{record.date}</td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{record.category}</td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{record.position}</td>
                    <td className="py-4 px-4 text-gray-200 font-semibold text-sm">{record.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Items per page:</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-zinc-700 text-gray-300 px-3 py-1 pr-8 rounded border border-zinc-600 focus:border-red-500 focus:outline-none appearance-none cursor-pointer text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="absolute right-2 top-1.5 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">1-1 of 1</span>
              <div className="flex gap-1">
                <button className="p-1 rounded hover:bg-zinc-700 text-gray-500 transition-colors" disabled>
                  <ChevronsLeft size={20} />
                </button>
                <button className="p-1 rounded hover:bg-zinc-700 text-gray-500 transition-colors" disabled>
                  <ChevronLeft size={20} />
                </button>
                <button className="p-1 rounded hover:bg-zinc-700 text-gray-500 transition-colors" disabled>
                  <ChevronRight size={20} />
                </button>
                <button className="p-1 rounded hover:bg-zinc-700 text-gray-500 transition-colors" disabled>
                  <ChevronsRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}