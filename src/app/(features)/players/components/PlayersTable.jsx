"use client";
import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Filter, File, Trash2 } from "lucide-react";
import CreatePlayerModal from "./AddPlayer";
import { useDispatch, useSelector } from "react-redux";
import { getPlayersAdmin ,deleteAllUsers  } from "@/redux/slice/playersSlice";
import { useRouter } from "next/navigation";
import { RiFileExcel2Line } from "react-icons/ri";
import "jspdf-autotable";
import toast from "react-hot-toast";
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading, confirmText, setConfirmText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] md:w-[500px] rounded-2xl p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          ✕
        </button>
        
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Confirm Deactivation
          </h3>
          <p className="text-gray-600 mb-4">
            This action will deactivate all active users and remove their tournament references. 
            This action cannot be undone.
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-bold">DEACTIVATE_ALL_USERS</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DEACTIVATE_ALL_USERS"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-2">
              This is required to prevent accidental deactivation.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmText !== "DEACTIVATE_ALL_USERS" || isLoading}
              className={`flex-1 px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                confirmText === "DEACTIVATE_ALL_USERS" && !isLoading
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                "Deactivate All Users"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function PlayersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const itemsPerPage = 10;
  const [showFilter, setShowFilter] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState("All");
  // const statusOptions = ["All", "Active", "Inactive"];
   const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const { players, loading, error, deleteAllLoading } = useSelector((state) => state.playerSlice);


   useEffect(() => {
    if (deleteAllLoading === false && players.length > 0) {
      // Check if there are any active users left
      const activeUsersCount = players.filter(player => player.isActive === true).length;
      
      if (activeUsersCount === 0 && players.length > 0) {
        
      }
    }
  }, [players, deleteAllLoading]);


    const handleDeleteAllUsers = async () => {
    if (confirmText !== "DEACTIVATE_ALL_USERS") {
      toast.error("Please type the confirmation text exactly as shown", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await dispatch(deleteAllUsers(confirmText)).unwrap();
      
      toast.success(result.message || "Successfully deactivated all users!", {
        position: "top-right",
        autoClose: 5000,
      });
      
      // Close modal and reset
      setShowDeleteAllModal(false);
      setConfirmText("");
      
      // Refresh the players list
      dispatch(getPlayersAdmin());
      
    } catch (error) {
      toast.error(error || "Failed to deactivate users", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    dispatch(getPlayersAdmin());
  }, [dispatch]);

  useEffect(() => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedClub, selectedCountry]);

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const { jsPDF } = await import("jspdf");
      await import("jspdf-autotable");

      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(30, 0, 102);
      doc.setFont("helvetica", "bold");
      doc.text("Players List", 105, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated on: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        105,
        28,
        { align: "center" }
      );

      let filterInfo = "All Players";
      if (searchTerm || selectedClub !== "All" || selectedCountry !== "All") {
        const filters = [];
        if (searchTerm) filters.push(`Search: ${searchTerm}`);
        if (selectedClub !== "All") filters.push(`Club: ${selectedClub}`);
        if (selectedCountry !== "All")
          filters.push(`Country: ${selectedCountry}`);
      }

      doc.text(filterInfo, 105, 35, { align: "center" });

      doc.text(`Total Players: ${filteredPlayers.length}`, 105, 42, {
        align: "center",
      });

      const tableData = filteredPlayers.map((player, index) => [
        index + 1,
        player.name?.trim() || "-",
        player.qid?.trim() || "-",
        player.club?.name?.trim() || "N/A",
        player.country?.trim() || "N/A",
        player.mobile?.trim() || "-",
      ]);

      // Generate table with better styling
      doc.autoTable({
        startY: 50,
        head: [["#", "Player Name", "QID", "Club", "Country", "Mobile"]],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: [0, 0, 0],
          font: "helvetica",
        },
        headStyles: {
          fillColor: [30, 0, 102],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10,
          cellPadding: 4,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 255],
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 35 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
        },
        margin: { top: 50 },
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.1,
      });

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      doc.save(`players_list_${timestamp}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);

      try {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.setTextColor(30, 0, 102);
        doc.text("Players List", 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Total Players: ${filteredPlayers.length}`, 20, 38);

        let yPosition = 50;
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);

        doc.setFont("helvetica", "bold");
        doc.text("#", 20, yPosition);
        doc.text("Player Name", 30, yPosition);
        doc.text("QID", 80, yPosition);
        doc.text("Club", 120, yPosition);
        doc.text("Country", 160, yPosition);

        yPosition += 6;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;

        doc.setFont("helvetica", "normal");
        filteredPlayers.forEach((player, index) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          doc.text(`${index + 1}`, 20, yPosition);
          doc.text(player.name?.substring(0, 25) || "-", 30, yPosition);
          doc.text(player.qid?.substring(0, 15) || "-", 80, yPosition);
          doc.text(
            player.club?.name?.substring(0, 15) || "N/A",
            120,
            yPosition
          );
          doc.text(player.country?.substring(0, 15) || "N/A", 160, yPosition);

          yPosition += 6;
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        doc.save(`players_simple_${timestamp}.pdf`);
      } catch (fallbackError) {
        console.error("Fallback PDF also failed:", fallbackError);
        alert("Failed to generate PDF. Please try exporting as Excel instead.");
      }
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  useEffect(() => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedClub, selectedCountry]);

  const clubs = [
    "All",
    ...new Set(players.map((p) => p.club?.name).filter(Boolean)),
  ];
  const countries = [
    "All",
    ...new Set(players.map((p) => p.country).filter(Boolean)),
  ];

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.qid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.mobile?.includes(searchTerm);

    const matchesClub =
      selectedClub === "All" || player.club?.name === selectedClub;
    const matchesCountry =
      selectedCountry === "All" || player.country === selectedCountry;

    // Only show active players
    const isActive = player.isActive === true;

    return matchesSearch && matchesClub && matchesCountry && isActive;
  });

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  const handlePlayerClick = (playerId) => {
    router.push(`/players/${playerId}`);
  };


    const activeUsersCount = players.filter(player => player.isActive === true).length;

  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    try {
      const headers = [
        "Sl.no",
        "Player Name",
        "QID",
        "Club",
        "Country",
        "Mobile",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredPlayers.map((player, index) =>
          [
            index + 1,
            `"${player.name || ""}"`,
            `"${player.qid || ""}"`,
            `"${player.club?.name || "N/A"}"`,
            `"${player.country || "N/A"}"`,
            `"${player.mobile || ""}"`,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `players_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const TableSkeleton = () => (
    <div className="space-y-4">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="hidden md:block">
            <div className="flex space-x-4 px-6 py-4 border-b border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-8"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
          <div className="md:hidden bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-4">
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const CardSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
        >
          <div className="space-y-3">
            <div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
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
              What are you looking for
            </p>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-[260px]">
                  <input
                    type="text"
                    placeholder="Search player name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white text-black px-4 py-3 rounded-xl pl-12 outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>

                {/* Filter */}
                <button
                  onClick={() => setShowFilter(true)}
                  className="bg-white px-4 py-3 rounded-xl flex items-center gap-2 text-black shadow-md"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
                {activeUsersCount > 0 && (
                  <button
                    onClick={() => setShowDeleteAllModal(true)}
                    disabled={deleteAllLoading}
                    className="bg-red-600 px-6 py-3 rounded-xl text-white shadow-md font-medium flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteAllLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Deactivate All
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white px-6 py-3 rounded-xl text-black shadow-md font-medium flex items-center gap-2"
                >
                  + Create Player
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloadingPDF}
                    className="border border-white text-white px-4 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
                  >
                    {isDownloadingPDF ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-1 border-white"></div>
                    ) : (
                      <File className="w-4 h-4" />
                    )}
                    {isDownloadingPDF ? "Generating..." : "PDF"}
                  </button>

                  <button
                    onClick={handleDownloadExcel}
                    disabled={isDownloading}
                    className="border border-white text-white px-4 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-1 border-white"></div>
                    ) : (
                      <RiFileExcel2Line className="w-4 h-4" />
                    )}
                    Excel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e0066] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading players data...</p>
              </div>
            </div>
          )}

          {!loading && (
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {isFilterLoading ? (
                <TableSkeleton />
              ) : error ? (
                <div className="px-6 py-12 text-center text-red-500">
                  {error}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-[#1a1a1a] bg-[#fafafa] border-b border-gray-200">
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Sl.no
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Player name
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          QID
                        </th>

                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Club
                        </th>
                        <th className="px-6 py-4 font-semibold text-sm text-left">
                          Country
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentPlayers.length > 0 ? (
                        currentPlayers.map((player, index) => (
                          <tr
                            key={player._id}
                            onClick={() => handlePlayerClick(player._id)}
                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {startIndex + index + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {player.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {player.qid}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-900">
                              {player.club?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {player.country || "N/A"}
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
              )}
            </div>
          )}

          {!loading && (
            <div className="md:hidden space-y-4">
              {isFilterLoading ? (
                <CardSkeleton />
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
                        <div className="text-xs text-gray-500 mb-1">
                          Player name
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {player.name}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">QID</div>
                        <div className="text-sm text-gray-700">
                          {player.qid}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Club</div>
                          <div className="text-sm text-gray-700">
                            {player.club?.name || "N/A"}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">
                            Country
                          </div>
                          <div className="text-sm text-gray-700">
                            {player.country || "N/A"}
                          </div>
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
          )}

          {!loading && !isFilterLoading && (
            <div className="mt-4 text-gray-600 text-sm">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredPlayers.length)} of{" "}
              {filteredPlayers.length} players
            </div>
          )}

          {!loading && !isFilterLoading && totalPages > 1 && (
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
        </div>
      </div>{" "}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] md:w-[600px] rounded-2xl p-6 relative shadow-xl">
            <button
              onClick={() => setShowFilter(false)}
              className="absolute top-4 right-4 text-black"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="text-gray-700 font-medium">Club</label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl mt-2"
                >
                  {clubs.map((club) => (
                    <option key={club}>{club}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-medium">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl mt-2"
                >
                  {countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </div>
              {/* <div>
                <label className="text-gray-700 font-medium">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl mt-2"
                >
                  {statusOptions.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div> */}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowFilter(false)}
                className="px-10 py-3 rounded-xl text-white font-medium"
                style={{
                  background:
                    "linear-gradient(270deg, #090979 0%, #1D0A54 100%)",
                }}
              >
                View List
              </button>
            </div>
          </div>
        </div>
      )}
         <ConfirmationModal
        isOpen={showDeleteAllModal}
        onClose={() => {
          setShowDeleteAllModal(false);
          setConfirmText("");
        }}
        onConfirm={handleDeleteAllUsers}
        isLoading={deleteAllLoading}
        confirmText={confirmText}
        setConfirmText={setConfirmText}
      />
      {/* Modal */}
      <CreatePlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
