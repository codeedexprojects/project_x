"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Trophy,
  Search,
  Edit2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTournament,
  getTournamentsAdmin,
} from "@/redux/slice/tournamentSlice";
import CreateTournamentModal from "./CreateTournamentModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";

export default function TournamentsTable() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tournaments, loading, error } = useSelector(
    (state) => state.tournamentsSlice
  );
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getTournamentsAdmin());
  }, [dispatch]);

  const handleCreateTournament = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleFormSubmit = (formData) => {
    console.log("Form data:", formData);
    setIsCreateModalOpen(false);
  };

  const handleViewTournament = (tournamentId) => {
    router.push(`/tournaments/${tournamentId}`);
  };

  const handleEditTournament = (tournamentId, e) => {
    e.stopPropagation();
    const tournament = tournaments.find((t) => t._id === tournamentId);
    setSelectedTournament(tournament);
    setIsEditModalOpen(true);
  };

  const cancelEdit = () => {
    setIsEditModalOpen(false);
    setSelectedTournament(null);
  };

  const handleDeleteTournament = (tournamentId, e) => {
    e.stopPropagation();
    const tournament = tournaments.find((t) => t._id === tournamentId);
    setSelectedTournament(tournament);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTournament) {
      setDeletingId(selectedTournament._id);
      try {
        await dispatch(deleteTournament(selectedTournament._id)).unwrap();
        setIsDeleteModalOpen(false);
        setSelectedTournament(null);
      } catch (error) {
        console.error("Failed to delete tournament:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedTournament(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (startDate) => {
    if (!startDate) return false;
    return new Date(startDate) > new Date();
  };

  const isActive = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  // Get unique statuses
  const statuses = ["All", "Active", "Upcoming", "Completed"];

  // Filter tournaments based on search and status
  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (selectedStatus === "Active") {
      matchesStatus = isActive(tournament.start_date, tournament.end_date);
    } else if (selectedStatus === "Upcoming") {
      matchesStatus = isUpcoming(tournament.start_date);
    } else if (selectedStatus === "Completed") {
      matchesStatus = !isUpcoming(tournament.start_date) && !isActive(tournament.start_date, tournament.end_date);
    }
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTournaments = filteredTournaments.slice(startIndex, endIndex);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Tournaments
            </h1>
            <button
              onClick={handleCreateTournament}
              className="bg-[#1e0066] hover:bg-[#1e0066] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg"
            >
              CREATE TOURNAMENT
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
                    placeholder="Search tournament name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-black pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                </div>
              </div>

          

              {/* Place Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place
                </label>
                <select
                  className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                >
                  <option>All Locations</option>
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
                Loading tournaments...
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[#1a1a1a] bg-[#fafafa] border-b border-gray-200">
                      <th className="px-6 py-4 font-semibold text-sm text-left">Sl.no</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Tournament Name</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Place</th>
                      <th className="px-6 py-4 font-semibold text-sm text-left">Start & End Date</th>
                      {/* <th className="px-6 py-4 font-semibold text-sm text-left">Actions</th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {currentTournaments.length > 0 ? (
                      currentTournaments.map((tournament, index) => (
                        <tr
                          key={tournament._id}
                          onClick={() => handleViewTournament(tournament._id)}
                          className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {tournament.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {tournament.location || "Location not specified"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div>Starts: {formatDateTime(tournament.start_date)}</div>
                            <div>Ends: {formatDateTime(tournament.end_date)}</div>
                          </td>
                          {/* <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => handleEditTournament(tournament._id, e)}
                                className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                title="Edit Tournament"
                              >
                                <Edit2 size={18} className="text-gray-700" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteTournament(tournament._id, e)}
                                disabled={deletingId === tournament._id}
                                className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
                                title="Delete Tournament"
                              >
                                {deletingId === tournament._id ? (
                                  <div className="animate-spin rounded-full h-[18px] w-[18px] border-b-2 border-gray-700"></div>
                                ) : (
                                  <Trash2 size={18} className="text-gray-700" />
                                )}
                              </button>
                            </div>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          No tournaments found matching your search criteria
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
                Loading tournaments...
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-500">
                {error}
              </div>
            ) : currentTournaments.length > 0 ? (
              currentTournaments.map((tournament, index) => (
                <div 
                  key={tournament._id} 
                  onClick={() => handleViewTournament(tournament._id)}
                  className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Tournament name</div>
                        <div className="text-sm font-medium text-gray-900">{tournament.name}</div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => handleEditTournament(tournament._id, e)}
                          className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                          title="Edit Tournament"
                        >
                          <Edit2 size={16} className="text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTournament(tournament._id, e)}
                          disabled={deletingId === tournament._id}
                          className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
                          title="Delete Tournament"
                        >
                          {deletingId === tournament._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                          ) : (
                            <Trash2 size={16} className="text-gray-700" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Place</div>
                        <div className="text-sm text-gray-700">{tournament.location || "Location not specified"}</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="text-xs text-gray-500 mb-1">Start & End Date</div>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div>Starts: {formatDateTime(tournament.start_date)}</div>
                        <div>Ends: {formatDateTime(tournament.end_date)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                No tournaments found matching your search criteria
              </div>
            )}
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-4 text-gray-600 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredTournaments.length)} of {filteredTournaments.length} tournaments
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

      {/* Modals */}
      <CreateTournamentModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleFormSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        tournament={selectedTournament}
        isDeleting={deletingId === selectedTournament?._id}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={cancelEdit}
      />
    </>
  );
}