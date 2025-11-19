"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  Users,
  Trophy,
  PencilIcon,
  Search,
  Edit2,
  ChevronLeft,
  ChevronRight,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter tournaments based on search query
  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tournament name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-black pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute  right-4 top-1/3 transform -translate-y-1/2 text-black" size={20} />
          </div>

          {/* Total Tournament Card */}
          <div className="bg-purple-900 text-white rounded-lg px-6 py-3 flex items-center gap-4 justify-between lg:w-64">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded">
                <Trophy className="w-6 h-6 text-purple-900" />
              </div>
              <div>
                <div className="text-xs opacity-90">Total</div>
                <div className="text-sm font-medium">tournament</div>
              </div>
            </div>
            <div className="text-4xl font-bold">{tournaments.length}</div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateTournament}
            className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <span className="font-medium">Create tournament</span>
            <Plus size={20} />
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <p className="text-gray-400 mt-2">Loading tournaments...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <div className="text-red-400 text-lg mb-2">⚠️</div>
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => dispatch(getTournamentsAdmin())}
                className="mt-4 text-red-400 hover:text-red-300 underline"
              >
                Try Again
              </button>
            </div>
          ) : filteredTournaments.length > 0 ? (
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Tournament Name</th>
                  <th className="px-6 py-4 text-left font-medium">Place</th>
                  <th className="px-6 py-4 text-left font-medium">Start & End Date</th>
                  <th className="px-6 py-4 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTournaments.map((tournament) => (
                  <tr
                    key={tournament._id}
                    onClick={() => handleViewTournament(tournament._id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{tournament.name.slice(0,20)}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {tournament.location || "Location not specified"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">
                        <div>Starts: {formatDateTime(tournament.start_date)}</div>
                        <div>Ends: {formatDateTime(tournament.end_date)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-16 text-center">
              <Trophy size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-700 text-lg font-semibold mb-2">
                No tournaments found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchQuery ? "Try a different search term" : "Get started by creating your first tournament"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateTournament}
                  className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Create Tournament
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="px-6 py-12 text-center bg-white rounded-lg">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <p className="text-gray-400 mt-2">Loading tournaments...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center bg-white rounded-lg">
              <div className="text-red-400 text-lg mb-2">⚠️</div>
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => dispatch(getTournamentsAdmin())}
                className="mt-4 text-red-400 hover:text-red-300 underline"
              >
                Try Again
              </button>
            </div>
          ) : filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament) => (
              <div
                key={tournament._id}
                onClick={() => handleViewTournament(tournament._id)}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base flex-1 pr-2">
                    {tournament.name}
                  </h3>
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
                
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-500 font-medium">Place:</span>
                    <span className="text-gray-900">
                      {tournament.location || "Location not specified"}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="text-gray-500 font-medium mb-1">Start & End Date:</div>
                    <div className="text-gray-900 space-y-1">
                      <div>Starts: {formatDateTime(tournament.start_date)}</div>
                      <div>Ends: {formatDateTime(tournament.end_date)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-16 text-center bg-white rounded-lg">
              <Trophy size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-700 text-lg font-semibold mb-2">
                No tournaments found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchQuery ? "Try a different search term" : "Get started by creating your first tournament"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateTournament}
                  className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Create Tournament
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredTournaments.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            <div className="flex gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded ${
                  currentPage === 1
                    ? 'bg-purple-900 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                1
              </button>
            </div>

            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 order-3"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Create Tournament Modal */}
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
      </div>
    </div>
  );
}