"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  Trophy,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUniversalRankings } from "@/redux/slice/rankingSlice";
import { getTournamentsAdmin } from "@/redux/slice/tournamentSlice";
import { getCategories } from "@/redux/slice/categorySlice";

const LeaderboardTable = () => {
  const dispatch = useDispatch();
  const { loading, error, currentRanking } = useSelector(
    (state) => state.rankings
  );

  const { tournaments } = useSelector((state) => state.tournamentsSlice);
  const { category: categories } = useSelector((state) => state.category);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    dispatch(getTournamentsAdmin());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (
      !hasInitialized &&
      tournaments &&
      tournaments.length > 0 &&
      categories &&
      categories.length > 0
    ) {
      const firstTournament = tournaments[0];
      setSelectedTournament(firstTournament._id);
      const firstCategory = categories[0];
      setSelectedCategory(firstCategory._id);

      setHasInitialized(true);
    }
  }, [tournaments, categories, hasInitialized]);

  useEffect(() => {
    if (selectedTournament && selectedCategory) {
      dispatch(
        getUniversalRankings({
          tournamentId: selectedTournament,
          categoryId: selectedCategory,
        })
      );
    }
  }, [dispatch, selectedTournament, selectedCategory]);

  const handleSearch = () => {
    if (selectedTournament && selectedCategory) {
      dispatch(
        getUniversalRankings({
          tournamentId: selectedTournament,
          categoryId: selectedCategory,
        })
      );
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

  const filteredPlayers =
    currentRanking?.players?.filter((player) => {
      const userName = player.user?.name?.toLowerCase() || "";
      const userQid = player.user?.qid?.toLowerCase() || "";
      const partnerName = player.partner?.name?.toLowerCase() || "";
      const partnerQid = player.partner?.qid?.toLowerCase() || "";
      const memberId = player.memberId?.toLowerCase() || "";

      return (
        userName.includes(searchTerm.toLowerCase()) ||
        userQid.includes(searchTerm.toLowerCase()) ||
        partnerName.includes(searchTerm.toLowerCase()) ||
        partnerQid.includes(searchTerm.toLowerCase()) ||
        memberId.includes(searchTerm.toLowerCase())
      );
    }) || [];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  const MedalIcon = ({ rank }) => {
    if (rank === 1) {
      return (
        <div className="w-10 h-10 relative flex items-center justify-center">
          <img
            src="/r1.jpg"
            alt="1st Place"
            className="w-full h-full object-contain"
          />
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="w-10 h-10 relative flex items-center justify-center">
          <img
            src="/r2.png"
            alt="2nd Place"
            className="w-full h-full object-contain"
          />
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="w-10 h-10 relative flex items-center justify-center">
          <img
            src="/r3.png"
            alt="3rd Place"
            className="w-full h-full object-contain"
          />
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
    const isDoubles = player.categoryType === "doubles";

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {player.user?.name || "Unknown Player"}
          </div>
          <div className="text-sm text-gray-600">
            QID: {player.user?.qid || "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            Member ID: {player.memberId || "N/A"}
          </div>
        </div>

        {showPartner && isDoubles && player.partner && (
          <div className="border-t pt-2 mt-2">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Partner:
            </div>
            <div className="text-sm text-gray-600">{player.partner.name}</div>
            <div className="text-xs text-gray-500">
              QID: {player.partner.qid}
            </div>
          </div>
        )}
      </div>
    );
  };

  const MobilePlayerCard = ({ player }) => {
    const isDoubles = player.categoryType === "doubles";

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
            <div className="text-red-600 font-semibold mb-2">
              Error Loading Leaderboard
            </div>
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
        <div
          className="rounded-2xl p-6 md:p-8 mb-6"
          style={{
            background:
              "linear-gradient(277.59deg, #17057C -12.13%, #000000 115.41%)",
          }}
        >
          <p className="text-white text-lg font-medium mb-4">
            Filter Leaderboard
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              <div className="relative w-full md:w-[260px]">
                <input
                  type="text"
                  placeholder="Search Name, QID, Member ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white text-black px-4 py-3 rounded-xl pl-12 outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              <select
                value={selectedTournament}
                onChange={(e) => handleTournamentChange(e.target.value)}
                disabled={!tournaments || tournaments.length === 0}
                className="bg-white px-4 py-3 rounded-xl text-black shadow-md cursor-pointer outline-none w-[180px]"
              >
                <option value="">Tournament</option>
                {tournaments &&
                  tournaments.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={!categories || categories.length === 0}
                className="bg-white px-4 py-3 rounded-xl text-black shadow-md cursor-pointer outline-none w-[180px]"
              >
                <option value="">Category</option>
                {categories &&
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
              <button
                onClick={handleSearch}
                disabled={!selectedTournament || !selectedCategory || loading}
                className="px-6 py-3 bg-white text-black rounded-xl shadow-md font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Loading leaderboard...</p>
          </div>
        )}

        {!loading && (!selectedTournament || !selectedCategory) && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-700 text-lg font-semibold mb-2">
              Loading Tournament and Category...
            </h3>
            <p className="text-gray-500 text-sm">
              Please wait while we load the available tournaments and categories
            </p>
          </div>
        )}

        {!loading &&
          selectedTournament &&
          selectedCategory &&
          currentRanking?.players?.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-700 text-lg font-semibold mb-2">
                No Players Found
              </h3>
              <p className="text-gray-500 text-sm">
                No ranking data available for the selected tournament and
                category
              </p>
            </div>
          )}

        {!loading &&
          currentRanking?.players &&
          currentRanking.players.length > 0 && (
            <>
              <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-[#1a1a1a] bg-[#fafafa] border-b border-gray-200">
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Rank
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Player Information
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Partner Information
                        </th>
                        {/* <th className="px-6 py-4 font-semibold text-sm text-left">Position</th> */}
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Points
                        </th>
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
                                <span className="text-gray-400 text-sm">
                                  No Partner
                                </span>
                              )}
                            </td>
                            {/* <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {player.position}
                            </span>
                          </td> */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-gray-900">
                                  {player.points}
                                </span>
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

              {filteredPlayers.length > 0 && (
                <div className="mt-4 text-gray-600 text-sm">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredPlayers.length)} of{" "}
                  {filteredPlayers.length} players
                  {searchTerm &&
                    ` (filtered from ${currentRanking.players.length} total)`}
                </div>
              )}

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
                              ? "bg-[#1e0066] text-white font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum.toString().padStart(2, "0")}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
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
