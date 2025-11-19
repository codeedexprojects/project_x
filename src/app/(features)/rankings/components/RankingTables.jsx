"use client"
import React, { useState } from 'react';
import { Search, ChevronDown, Star } from 'lucide-react';

const LeaderboardTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const leaderboardData = [
    { rank: 1, name: 'Sudhakaran', gid: '23456789056', club: 'Kumaran co', points: 100 },
    { rank: 2, name: 'Sudhakaran', gid: '23456789056', club: 'Kumaran co', points: 80 },
    { rank: 3, name: 'Sudhakaran', gid: '23456789056', club: 'Kumaran co', points: 70 },
    { rank: 4, name: 'Sudhakaran', gid: '23456789056', club: 'Kumaran co', points: 60 },
    { rank: 5, name: 'Sudhakaran', gid: '23456789056', club: 'Kumaran co', points: 50 },
    { rank: 6, name: 'Sudhakaran', gid: '23456789056', club: 'Kumaran co', points: 40 },
  ];

  const MedalIcon = ({ rank }) => {
    if (rank === 1) {
      return (
        <div className="w-12 h-12 relative">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <circle cx="24" cy="24" r="22" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
            <circle cx="24" cy="24" r="18" fill="#FFC700"/>
            <text x="24" y="30" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">1</text>
          </svg>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="w-12 h-12 relative">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <circle cx="24" cy="24" r="22" fill="#C0C0C0" stroke="#A8A8A8" strokeWidth="2"/>
            <circle cx="24" cy="24" r="18" fill="#D3D3D3"/>
            <text x="24" y="30" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">2</text>
          </svg>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="w-12 h-12 relative">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <circle cx="24" cy="24" r="22" fill="#CD7F32" stroke="#A0522D" strokeWidth="2"/>
            <circle cx="24" cy="24" r="18" fill="#D2691E"/>
            <text x="24" y="30" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">3</text>
          </svg>
        </div>
      );
    }
    return <span className="text-gray-700 font-semibold text-lg">{rank < 10 ? `0${rank}` : rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search Club name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-black px-4 py-3 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Select Tournament Dropdown */}
          <div className="flex-1 lg:flex-none lg:w-64">
            <div className="relative">
              <select
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg border-none bg-indigo-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-700 appearance-none cursor-pointer"
              >
                <option value="">Select tournament</option>
                <option value="tournament1">Tournament 1</option>
                <option value="tournament2">Tournament 2</option>
                <option value="tournament3">Tournament 3</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Select Category Dropdown */}
          <div className="flex-1 lg:flex-none lg:w-64">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg border-none bg-indigo-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-700 appearance-none cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                <option value="category3">Category 3</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Player name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">GID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Club</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Point</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((player, index) => (
                <tr key={index} className={index !== leaderboardData.length - 1 ? 'border-b border-gray-200' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MedalIcon rank={player.rank} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{player.name}</td>
                  <td className="px-6 py-4 text-gray-700">{player.gid}</td>
                  <td className="px-6 py-4 text-gray-700">{player.club}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{player.points}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {leaderboardData.map((player, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start gap-4 mb-3">
                <div className="flex-shrink-0">
                  <MedalIcon rank={player.rank} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{player.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">GID: {player.gid}</p>
                  <p className="text-sm text-gray-600 mb-2">{player.club}</p>
                  <div className="flex items-center gap-1 text-gray-700">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{player.points} Points</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-sm"
          >
            &lt; Previous
          </button>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded ${
                  currentPage === page
                    ? 'bg-indigo-900 text-white'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                {page.toString().padStart(2, '0')}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-sm"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTable;