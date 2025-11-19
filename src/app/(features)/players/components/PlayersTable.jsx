"use client";
import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import CreatePlayerModal from "./AddPlayer";
import { useDispatch, useSelector } from "react-redux";
import { getPlayersAdmin } from "@/redux/slice/playersSlice";
import { useRouter } from "next/navigation";

export default function PlayersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;
  
  const dispatch = useDispatch();
  const router = useRouter();

  const { players, loading, error } = useSelector(
    (state) => state.playerSlice
  );

  useEffect(() => {
    dispatch(getPlayersAdmin());
  }, [dispatch]);

  // Get unique clubs and countries
  const clubs = ["All", ...new Set(players.map(p => p.club?.name).filter(Boolean))];
  const countries = ["All", ...new Set(players.map(p => p.country).filter(Boolean))];

  // Filter players
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = 
      player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.qid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.mobile?.includes(searchTerm);
    
    const matchesClub = selectedClub === "All" || player.club?.name === selectedClub;
    const matchesCountry = selectedCountry === "All" || player.country === selectedCountry;
    
    return matchesSearch && matchesClub && matchesCountry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  const handlePlayerClick = (playerId) => {
    router.push(`/players/${playerId}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Players
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1e0066] hover:bg-[#1e0066] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg "
            >
              CREATE PLAYER
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for Name, QID, Contact"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-black pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                </div>
              </div>

              {/* Club Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club
                </label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full px-4 text-black py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                >
                  {clubs.map((club) => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Filter Button */}
              <div className="flex items-end">
                <button className="w-full lg:w-auto px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table Section - Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            {loading ? (
              <div className="px-6 py-12 text-center text-gray-500">
                Loading players...
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#1e0066] text-white">
                      <th className="px-6 py-3.5 text-left font-normal text-sm border-r border-[#2a0080] last:border-r-0">Player name</th>
                      <th className="px-6 py-3.5 text-left font-normal text-sm border-r border-[#2a0080] last:border-r-0">QID</th>
                      <th className="px-6 py-3.5 text-left font-normal text-sm border-r border-[#2a0080] last:border-r-0">Club</th>
                      <th className="px-6 py-3.5 text-left font-normal text-sm border-r border-[#2a0080] last:border-r-0">Country</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {currentPlayers.length > 0 ? (
                      currentPlayers.map((player) => (
                        <tr 
                          key={player._id} 
                          onClick={() => handlePlayerClick(player._id)}
                          className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 text-gray-900 text-sm border-r border-gray-200 last:border-r-0">{player.name}</td>
                          <td className="px-6 py-4 text-gray-900 text-sm border-r border-gray-200 last:border-r-0">{player.qid}</td>
                          <td className="px-6 py-4 text-gray-900 text-sm border-r border-gray-200 last:border-r-0">{player.club?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-gray-900 text-sm border-r border-gray-200 last:border-r-0">{player.country || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                          No players found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Card View - Mobile */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                Loading players...
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-500">
                {error}
              </div>
            ) : currentPlayers.length > 0 ? (
              currentPlayers.map((player) => (
                <div 
                  key={player._id} 
                  onClick={() => handlePlayerClick(player._id)}
                  className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Player name</div>
                      <div className="text-sm font-medium text-gray-900">{player.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">QID</div>
                      <div className="text-sm text-gray-700">{player.qid}</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Club</div>
                        <div className="text-sm text-gray-700">{player.club?.name || 'N/A'}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Country</div>
                        <div className="text-sm text-gray-700">{player.country || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                No players found matching your search criteria
              </div>
            )}
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-4 text-gray-600 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPlayers.length)} of {filteredPlayers.length} players
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow-sm">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#1e0066] text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum.toString().padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CreatePlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}