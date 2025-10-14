"use client";
import React, { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

export default function RankingsTable() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');

  const categories = ['Under 13', 'Under 15', 'Under 17', 'Under 19', 'Open'];
  const tournaments = [
    'JUSPO OPEN BADMINTON TOURNAMENT QATAR 2025',
    'R13A SUMMER SLAM 2025',
    'BQAB Summer Fest Badminton Tournament'
  ];

  // Sample data (empty by default)
  const rankings = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100">Rankings</h1>
          <button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105">
            <Download size={20} />
            EXPORT ALL RANKINGS
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-zinc-800 text-gray-300 px-4 py-3 pr-10 rounded-lg border border-zinc-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="w-full bg-zinc-800 text-gray-300 px-4 py-3 pr-10 rounded-lg border border-zinc-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Tournament</option>
              {tournaments.map((tournament, index) => (
                <option key={index} value={tournament}>
                  {tournament}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700/50 backdrop-blur-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-zinc-800/80 border-b border-zinc-700">
            <div className="col-span-2 px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Rank
            </div>
            <div className="col-span-3 px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
              QID
            </div>
            <div className="col-span-5 px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Player Name
            </div>
            <div className="col-span-2 px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Points
            </div>
          </div>

          {/* Table Body */}
          <div className="py-12 text-center">
            <p className="text-gray-400 text-lg">No data available</p>
          </div>
        </div>
      </div>
    </div>
  );
}