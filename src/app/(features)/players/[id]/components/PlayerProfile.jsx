"use client"
import React from 'react';
import { Trophy } from 'lucide-react';

export default function PlayerProfile({ 
  playerData, 
  tournaments, 
  onUpdate, 
  onExport, 
  onSave, 
  showActions = true 
}) {
  const getPositionColor = (color) => {
    const colors = {
      green: "bg-green-100 text-green-700",
      orange: "bg-orange-100 text-orange-700",
      blue: "bg-blue-100 text-blue-700",
      red: "bg-red-100 text-red-700"
    };
    return colors[color] || "bg-gray-100 text-gray-700";
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-purple-600";
    if (rank === 2) return "bg-purple-600";
    return "bg-purple-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Player Profile</h1>
          {showActions && (
            <div className="flex gap-2">
              <button 
                onClick={onUpdate}
                className="px-4 py-2 text-black text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Update
              </button>
              <button 
                onClick={onExport}
                className="px-4 py-2 text-black text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Export PDF
              </button>
              <button 
                onClick={onSave}
                className="px-4 py-2 text-sm bg-indigo-900 text-white rounded hover:bg-indigo-800"
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={playerData.profileImage}
                  alt="Profile"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <h2 className="text-lg font-semibold text-gray-800">{playerData.name}</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(playerData).map(([key, value]) => {
                  if (key === 'name' || key === 'profileImage') return null;
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return (
                    <div key={key}>
                      <label className="text-xs text-gray-500 block mb-1">{label}</label>
                      <div className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                        {value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Tournament History */}
          <div className="lg:col-span-2 space-y-6">
            {tournaments && tournaments.length > 0 ? (
              tournaments.map((tournament, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-50 to-white p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-gray-800">{tournament.title}</h3>
                    </div>
                    <span className={`${getRankColor(tournament.rank)} text-white text-xs font-semibold px-3 py-1 rounded`}>
                      Rank {tournament.rank}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Date</th>
                          <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Tournament</th>
                          <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Position</th>
                          <th className="text-right text-xs font-medium text-gray-600 px-4 py-3">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {tournament.matches.map((match, matchIdx) => (
                          <tr key={matchIdx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-600">{match.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{match.tournament}</td>
                            <td className="px-4 py-3">
                              <span className={`${getPositionColor(match.color)} text-xs font-medium px-3 py-1 rounded-full`}>
                                {match.position}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800 text-right font-medium">{match.points}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-semibold">
                          <td colSpan="3" className="px-4 py-3 text-sm text-gray-800">Total Points</td>
                          <td className="px-4 py-3 text-sm text-gray-800 text-right">{tournament.totalPoints}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Tournament History</h3>
                <p className="text-gray-500">This player hasn't participated in any tournaments yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}