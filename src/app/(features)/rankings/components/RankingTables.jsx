"use client"
import React, { useEffect, useState } from 'react';
import { Search, Star, ChevronLeft, ChevronRight, SlidersHorizontal, Users, Trophy } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getUniversalRankings } from '@/redux/slice/rankingSlice';
import { getTournamentsAdmin } from '@/redux/slice/tournamentSlice';
import { getCategories } from '@/redux/slice/categorySlice';

const LeaderboardTable = () => {
  const dispatch = useDispatch();
  const { 
    universalRankings, 
    loading, 
    error, 
    currentRanking 
  } = useSelector((state) => state.rankings);

  const { tournaments } = useSelector((state) => state.tournamentsSlice);
 const { category: categories } = useSelector((state) => state.category);


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Load tournaments and categories when component mounts
    dispatch(getTournamentsAdmin());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    // Load rankings when tournament or category changes
    if (selectedTournament && selectedCategory) {
      dispatch(getUniversalRankings({ 
        tournamentId: selectedTournament, 
        categoryId: selectedCategory 
      }));
    }
  }, [dispatch, selectedTournament, selectedCategory]);

  const handleSearch = () => {
    if (selectedTournament && selectedCategory) {
      dispatch(getUniversalRankings({ 
        tournamentId: selectedTournament, 
        categoryId: selectedCategory 
      }));
    }
  };

  const handleTournamentChange = (tournamentId) => {
    setSelectedTournament(tournamentId);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Filter players based on search term
  const filteredPlayers = currentRanking?.players?.filter((player) => {
    const userName = player.user?.name?.toLowerCase() || '';
    const userQid = player.user?.qid?.toLowerCase() || '';
    const partnerName = player.partner?.name?.toLowerCase() || '';
    const partnerQid = player.partner?.qid?.toLowerCase() || '';
    const memberId = player.memberId?.toLowerCase() || '';
    
    return (
      userName.includes(searchTerm.toLowerCase()) ||
      userQid.includes(searchTerm.toLowerCase()) ||
      partnerName.includes(searchTerm.toLowerCase()) ||
      partnerQid.includes(searchTerm.toLowerCase()) ||
      memberId.includes(searchTerm.toLowerCase())
    );
  }) || [];

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  const MedalIcon = ({ rank }) => {
    if (rank === 1) {
      return (
        <div className="w-10 h-10 relative flex items-center justify-center">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <circle cx="24" cy="24" r="22" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
            <circle cx="24" cy="24" r="18" fill="#FFC700"/>
            <text x="24" y="30" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">1</text>
          </svg>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="w-10 h-10 relative flex items-center justify-center">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <circle cx="24" cy="24" r="22" fill="#C0C0C0" stroke="#A8A8A8" strokeWidth="2"/>
            <circle cx="24" cy="24" r="18" fill="#D3D3D3"/>
            <text x="24" y="30" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">2</text>
          </svg>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="w-10 h-10 relative flex items-center justify-center">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <circle cx="24" cy="24" r="22" fill="#CD7F32" stroke="#A0522D" strokeWidth="2"/>
            <circle cx="24" cy="24" r="18" fill="#D2691E"/>
            <text x="24" y="30" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">3</text>
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 flex items-center justify-center">
        <span className="text-gray-700 font-semibold text-lg">
          {rank < 10 ? `0${rank}` : rank}
        </span>
      </div>
    );
  };

  const PlayerInfo = ({ player, showPartner = true }) => {
    const isDoubles = player.categoryType === 'doubles';
    
    return (
      <div className="space-y-2">
        {/* Main Player */}
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {player.user?.name || 'Unknown Player'}
          </div>
          <div className="text-sm text-gray-600">
            QID: {player.user?.qid || 'N/A'}
          </div>
          <div className="text-xs text-gray-500">
            Member ID: {player.memberId || 'N/A'}
          </div>
        </div>

        {/* Partner Information */}
        {showPartner && isDoubles && player.partner && (
          <div className="border-t pt-2 mt-2">
            <div className="text-xs font-medium text-gray-700 mb-1">Partner:</div>
            <div className="text-sm text-gray-600">
              {player.partner.name}
            </div>
            <div className="text-xs text-gray-500">
              QID: {player.partner.qid}
            </div>
          </div>
        )}
      </div>
    );
  };

  const MobilePlayerCard = ({ player }) => {
    const isDoubles = player.categoryType === 'doubles';
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <MedalIcon rank={player.rank} />
            </div>
            <div className="flex-1 min-w-0">
              <PlayerInfo player={player} showPartner={true} />
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-gray-700">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{player.points} Points</span>
                </div>
                
                {isDoubles && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Position: {player.position}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-semibold mb-2">Error Loading Leaderboard</div>
            <div className="text-red-500 text-sm mb-4">{error}</div>
            <button
              onClick={handleSearch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Leaderboard
          </h1>
          
          {/* Tournament and Category Info */}
          {currentRanking && (
            <div className="flex flex-col gap-2 text-right">
              <div className="text-lg font-semibold text-gray-900">
                {currentRanking.tournament?.name}
              </div>
              <div className="text-sm text-gray-600">
                {currentRanking.category?.name} • {currentRanking.category?.type}
              </div>
              <div className="text-xs text-gray-500">
                {currentRanking.players?.length || 0} players
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Players
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for Name, QID, Member ID, Partner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-black pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              </div>
            </div>

            {/* Tournament Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament
              </label>
              <select
                value={selectedTournament}
                onChange={(e) => handleTournamentChange(e.target.value)}
                className="w-full px-4 text-black py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                disabled={!tournaments || tournaments.length === 0}
              >
                <option value="">Select Tournament</option>
                {tournaments && tournaments.map((tournament) => (
                  <option key={tournament._id} value={tournament._id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
              {(!tournaments || tournaments.length === 0) && (
                <div className="text-xs text-gray-500 mt-1">Loading tournaments...</div>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                disabled={!categories || categories.length === 0}
              >
                <option value="">Select Category</option>
                {categories && categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name} 
                  </option>
                ))}
              </select>
              {(!categories || categories.length === 0) && (
                <div className="text-xs text-gray-500 mt-1">Loading categories...</div>
              )}
            </div>

            {/* Filter Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!selectedTournament || !selectedCategory || loading}
                className="w-full lg:w-auto px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <SlidersHorizontal className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Loading leaderboard...</p>
          </div>
        )}

        {/* Empty State - No Tournament/Category Selected */}
        {!loading && (!selectedTournament || !selectedCategory) && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-700 text-lg font-semibold mb-2">
              Select Tournament and Category
            </h3>
            <p className="text-gray-500 text-sm">
              Please select a tournament and category to view the leaderboard
            </p>
          </div>
        )}

        {/* Empty State - No Data */}
        {!loading && selectedTournament && selectedCategory && currentRanking?.players?.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-700 text-lg font-semibold mb-2">
              No Players Found
            </h3>
            <p className="text-gray-500 text-sm">
              No ranking data available for the selected tournament and category
            </p>
          </div>
        )}

        {/* Table Section - Desktop */}
        {!loading && currentRanking?.players && currentRanking.players.length > 0 && (
          <>
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[#1a1a1a] bg-[#fafafa] border-b border-gray-200">
                      <th className="px-6 py-4 font-semibold text-sm text-left">Rank</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Player Information</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Partner Information</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Position</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Points</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentPlayers.length > 0 ? (
                      currentPlayers.map((player) => (
                        <tr
                          key={`${player.user?._id}-${player.rank}-${player.memberId}`}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <MedalIcon rank={player.rank} />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <PlayerInfo player={player} showPartner={false} />
                          </td>
                          <td className="px-6 py-4">
                            {player.partner ? (
                              <div className="space-y-1">
                                <div className="font-medium text-gray-900">
                                  {player.partner.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  QID: {player.partner.qid}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No Partner</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {player.position}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-gray-900">{player.points}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          No players found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card View - Mobile */}
            <div className="md:hidden space-y-4">
              {currentPlayers.length > 0 ? (
                currentPlayers.map((player) => (
                  <MobilePlayerCard 
                    key={`${player.user?._id}-${player.rank}-${player.memberId}`} 
                    player={player} 
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                  No players found matching your search criteria
                </div>
              )}
            </div>

            {/* Results Count */}
            {filteredPlayers.length > 0 && (
              <div className="mt-4 text-gray-600 text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredPlayers.length)} of {filteredPlayers.length} players
                {searchTerm && ` (filtered from ${currentRanking.players.length} total)`}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
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
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardTable;