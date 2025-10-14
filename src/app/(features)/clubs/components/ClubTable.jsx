import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function ClubsTable() {
  const clubs = [
    { id: 1, name: 'Suchitra Badminton Academy' },
    { id: 2, name: "Master's Badminton Club" },
    { id: 3, name: 'Smashers Zone' },
    { id: 4, name: 'Athlen Sports' },
    { id: 5, name: 'Star Sports' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100">Clubs</h1>
          <button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105">
            <Plus size={20} />
            CREATE CLUB
          </button>
        </div>

        {/* Table */}
        <div className="bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700/50 backdrop-blur-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-zinc-800/80 border-b border-zinc-700">
            <div className="col-span-2 px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Club ID
            </div>
            <div className="col-span-7 px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Club Name
            </div>
            <div className="col-span-3 px-6 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Actions
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-700/50">
            {clubs.map((club, index) => (
              <div
                key={index}
                className="grid grid-cols-12 hover:bg-zinc-700/30 transition-colors duration-200"
              >
                <div className="col-span-2 px-6 py-5 text-gray-200 font-medium text-lg">
                  {club.id}
                </div>
                <div className="col-span-7 px-6 py-5 text-gray-200 font-medium">
                  {club.name}
                </div>
                <div className="col-span-3 px-6 py-5 flex justify-center items-center gap-3">
                  <button 
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200 transform hover:scale-110"
                    aria-label="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200 transform hover:scale-110"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-gray-400 text-sm">
          Showing {clubs.length} clubs
        </div>
      </div>
    </div>
  );
}