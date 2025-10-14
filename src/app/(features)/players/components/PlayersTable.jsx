"use client";
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import CreatePlayerModal from './AddPlayer';

export default function PlayersTable() {
  const [searchQID, setSearchQID] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const players = [
    { qid: '31535604340', name: 'Aadhira Satheesh Kumar' },
    { qid: '31935602525', name: 'Aadhrit' },
    { qid: '31735601837', name: 'Aadidev Aji' },
    { qid: '31535607403', name: 'Aadya Katragadda' },
    { qid: '31535604341', name: 'Aarav Sharma' },
    { qid: '31935602526', name: 'Abhishek Kumar' },
    { qid: '31735601838', name: 'Aditya Singh' },
    { qid: '31535607404', name: 'Ananya Reddy' }
  ];

  const filteredPlayers = players.filter(player => {
    const matchesQID = player.qid.toLowerCase().includes(searchQID.toLowerCase());
    const matchesName = player.name.toLowerCase().includes(searchName.toLowerCase());
    return matchesQID && matchesName;
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100">Players</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
            >
              CREATE PLAYER
            </button>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by QID"
                value={searchQID}
                onChange={(e) => setSearchQID(e.target.value)}
                className="w-full bg-zinc-800 text-gray-300 placeholder-gray-500 px-4 py-3 rounded-lg border border-zinc-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <Search className="absolute right-4 top-3.5 text-gray-500 w-5 h-5" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-zinc-800 text-gray-300 placeholder-gray-500 px-4 py-3 rounded-lg border border-zinc-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <Search className="absolute right-4 top-3.5 text-gray-500 w-5 h-5" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700/50 backdrop-blur-sm">
            {/* Table Header */}
            <div className="grid grid-cols-2 bg-zinc-800/80 border-b border-zinc-700">
              <div className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                QID
              </div>
              <div className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Name
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-zinc-700/50">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 hover:bg-zinc-700/30 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="px-6 py-4 text-gray-300 font-mono text-sm">
                      {player.qid}
                    </div>
                    <div className="px-6 py-4 text-gray-200 font-medium">
                      {player.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  No players found matching your search criteria
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-400 text-sm">
            Showing {filteredPlayers.length} of {players.length} players
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreatePlayerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}