"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  Trophy,
  FileText,
  Table,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUniversalRankings } from "@/redux/slice/rankingSlice";
import { getCategories } from "@/redux/slice/categorySlice";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const LeaderboardTable = () => {
  const dispatch = useDispatch();
  const { loading, error, currentRanking } = useSelector(
    (state) => state.rankings
  );

  const { category: categories } = useSelector((state) => state.category);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!hasInitialized && categories && categories.length > 0) {
      const firstCategory = categories[0];
      setSelectedCategory(firstCategory._id);
      setHasInitialized(true);
    }
  }, [categories, hasInitialized]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(
        getUniversalRankings({
          categoryId: selectedCategory,
        })
      );
    }
  }, [dispatch, selectedCategory]);

  const handleSearch = () => {
    if (selectedCategory) {
      dispatch(
        getUniversalRankings({
          categoryId: selectedCategory,
        })
      );
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Filter users based on search term
  const filteredUsers =
    currentRanking?.users?.filter((user) => {
      const userName = user?.name?.toLowerCase() || "";
      const userQid = user?.qid?.toLowerCase() || "";

      return (
        userName.includes(searchTerm.toLowerCase()) ||
        userQid.includes(searchTerm.toLowerCase())
      );
    }) || [];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Download Excel Function
// Update both download functions to use filteredUsers instead of currentRanking?.users

// Update downloadExcel function:
const downloadExcel = () => {
  if (!filteredUsers.length) return; // Changed from currentRanking?.users?.length

  const dataToExport = filteredUsers.map((user) => ({ // Changed from currentRanking?.users to filteredUsers
    Rank: user.rank,
    Name: user.name || "N/A",
    QID: user.qid || "N/A",
    Club: user.club?.name || "N/A",
    "Category Points": user.points || 0,
    "Total Points": user.totalPoints || 0,
    "Tournaments Played": user.tournamentsCount || 0,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rankings");

  const colWidths = [
    { wch: 8 },
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
  ];
  worksheet["!cols"] = colWidths;

  const categoryName = currentRanking.category?.name || "Rankings";
  const fileName = `${cleanFileName(
    categoryName
  )}_Rankings_${getCurrentDate()}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};

// Update downloadPDF function:
const downloadPDF = () => {
  if (!filteredUsers.length) return; // Changed from currentRanking?.users?.length

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  const categoryName = currentRanking.category?.name || "Rankings";
  const categoryType = currentRanking.category?.type || "";
  const totalPlayers = filteredUsers.length; // Changed from currentRanking?.users?.length
  const currentDate = new Date().toLocaleDateString();

  // Header
  doc.setFillColor(23, 5, 124);
  doc.rect(0, 0, pageWidth, 50, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text("RANKINGS REPORT", pageWidth / 2, 20, { align: "center" });

  // Subtitle
  doc.setFontSize(12);
  doc.text(categoryName, pageWidth / 2, 30, { align: "center" });

  // Metadata - Update to show filtered results
  doc.setFontSize(10);
  const searchInfo = searchTerm ? ` (Search: "${searchTerm}")` : "";
  doc.text(
    `Type: ${categoryType.toUpperCase()} | Players: ${totalPlayers}${searchInfo} | Date: ${currentDate}`,
    pageWidth / 2,
    40,
    { align: "center" }
  );

  yPosition = 60;

  // Column Headers
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, "F");

  doc.setTextColor(23, 5, 124);
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");

  const columns = [
    { name: "Rank", x: margin + 5 },
    { name: "Player Name", x: margin + 25 },
    { name: "QID", x: margin + 80 },
    { name: "Points", x: margin + 110 },
    { name: "Total", x: margin + 130 },
    { name: "Events", x: margin + 150 },
  ];

  columns.forEach((col) => {
    doc.text(col.name, col.x, yPosition + 8);
  });

  // Draw line under header
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition + 12, pageWidth - margin, yPosition + 12);

  yPosition += 20;

  // Player Data - using filteredUsers
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");

  filteredUsers.forEach((user, index) => { // Changed from currentRanking?.users to filteredUsers
    // Check for page break
    if (yPosition > 270) {
      doc.addPage();
      yPosition = margin;

      // Redraw header on new page
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, "F");

      doc.setTextColor(23, 5, 124);
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      columns.forEach((col) => {
        doc.text(col.name, col.x, yPosition + 8);
      });
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition + 12, pageWidth - margin, yPosition + 12);

      yPosition += 20;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
    }

    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPosition - 4, pageWidth - 2 * margin, 8, "F");
    }

    // Rank with special styling for top 3
    if (user.rank <= 3) {
      doc.setFillColor(255, 215, 0); // Gold color for top 3
      doc.setDrawColor(255, 215, 0);
      doc.rect(columns[0].x - 3, yPosition - 6, 15, 8, "F");
      doc.setTextColor(0, 0, 0);
    }

    // Display filtered rank (original rank from API)
    doc.text(user.rank.toString(), columns[0].x, yPosition);

    if (user.rank <= 3) {
      doc.setTextColor(0, 0, 0); // Reset color
    }

    // Player Name (truncated)
    const playerName = user.name || "N/A";
    const maxNameWidth = 45;
    const displayName = doc.splitTextToSize(playerName, maxNameWidth)[0];
    doc.text(displayName, columns[1].x, yPosition);

    // QID
    doc.text(user.qid || "N/A", columns[2].x, yPosition);

    // Points
    doc.text(user.points?.toString() || "0", columns[3].x, yPosition);

    // Total Points
    doc.text(user.totalPoints?.toString() || "0", columns[4].x, yPosition);

    // Tournaments
    doc.text(
      user.tournamentsCount?.toString() || "0",
      columns[5].x,
      yPosition
    );

    yPosition += 10;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, {
      align: "center",
    });
    doc.text(`Generated by Tournament System`, pageWidth / 2, 295, {
      align: "center",
    });
  }

  const fileName = `${cleanFileName(
    categoryName
  )}_Rankings_${getCurrentDate()}.pdf`;
  doc.save(fileName);
};

  // Helper functions
  const cleanFileName = (name) => {
    return name.replace(/[^a-zA-Z0-9]/g, "_");
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

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

  const UserInfo = ({ user }) => {
    return (
      <div className="space-y-1">
        <div className="font-medium text-gray-900">
          {user?.name || "Unknown Player"}
        </div>
        <div className="text-sm text-gray-600">QID: {user?.qid || "N/A"}</div>
        {user?.club?.name && (
          <div className="text-xs text-gray-500">Club: {user.club.name}</div>
        )}
      </div>
    );
  };

  const MobileUserCard = ({ user }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <MedalIcon rank={user.rank} />
            </div>
            <div className="flex-1 min-w-0">
              <UserInfo user={user} />

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-gray-700">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{user.points} Points</span>
                </div>

                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Tournaments: {user.tournamentsCount}
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                Total Points: {user.totalPoints}
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <p className="text-white text-lg font-medium">Filter Leaderboard</p>

          </div>

          <div className="flex flex-col lg:flex-row...">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-[260px]">
                  <input
                    type="text"
                    placeholder="Search Name, QID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white text-black px-4 py-3 rounded-xl pl-12 outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={!categories || categories.length === 0}
                  className="bg-white px-4 py-3 rounded-xl text-black shadow-md cursor-pointer outline-none w-[180px]"
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
                {/* PDF Download Button */}
                <button
                  onClick={downloadPDF}
                  disabled={!currentRanking?.users?.length}
                  className="border border-white text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>

                {/* Excel Download Button */}
                <button
                  onClick={downloadExcel}
                  disabled={!currentRanking?.users?.length}
                  className="border border-white text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Table className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Loading leaderboard...</p>
          </div>
        )}

        {!loading && !selectedCategory && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-700 text-lg font-semibold mb-2">
              Loading Categories...
            </h3>
            <p className="text-gray-500 text-sm">
              Please wait while we load the available categories
            </p>
          </div>
        )}

        {!loading &&
          selectedCategory &&
          currentRanking?.users?.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-700 text-lg font-semibold mb-2">
                No Players Found
              </h3>
              <p className="text-gray-500 text-sm">
                No ranking data available for the selected category
              </p>
            </div>
          )}

        {!loading &&
          currentRanking?.users &&
          currentRanking.users.length > 0 && (
            <>
              {/* Category Info */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentRanking.category?.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="capitalize">
                        {currentRanking.category?.type}
                      </span>
                      <span>•</span>
                      <span>
                        {currentRanking.pagination?.totalUsers || 0} Players
                      </span>
                    </div>
                  </div>

                  {/* Mobile Download Buttons */}
                  <div className="flex items-center gap-2 md:hidden">
                    <button
                      onClick={downloadExcel}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Table className="w-3 h-3" />
                      Excel
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <FileText className="w-3 h-3" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Table */}
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
                          Category Points
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Total Points
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Tournaments
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                          <tr
                            key={`${user._id}-${user.rank}`}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <MedalIcon rank={user.rank} />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <UserInfo user={user} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-gray-900">
                                  {user.points}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-gray-700">
                                {user.totalPoints}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.tournamentsCount}
                              </span>
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

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <MobileUserCard
                      key={`${user._id}-${user.rank}`}
                      user={user}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                    No players found matching your search criteria
                  </div>
                )}
              </div>

              {/* Pagination Info */}
              {filteredUsers.length > 0 && (
                <div className="mt-4 text-gray-600 text-sm">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredUsers.length)} of{" "}
                  {filteredUsers.length} players
                  {searchTerm &&
                    ` (filtered from ${currentRanking.users.length} total)`}
                </div>
              )}

              {/* Pagination Controls */}
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
