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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-black p-4 sm:p-6">
      <div className=" mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Tournaments
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage and organize your gaming tournaments
            </p>
          </div>
          <button
            onClick={handleCreateTournament}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 sm:px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 transform hover:scale-105 active:scale-95 w-full lg:w-auto justify-center"
          >
            <Plus size={20} />
            CREATE TOURNAMENT
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Trophy size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Tournaments</p>
                <p className="text-white text-xl font-bold">
                  {tournaments.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Calendar size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-white text-xl font-bold">
                  {
                    tournaments.filter((t) =>
                      isActive(t.start_date, t.end_date)
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-zinc-800/30 rounded-2xl overflow-hidden border border-zinc-700/50 backdrop-blur-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-zinc-800/80 border-b border-zinc-700/50 px-4 sm:px-6">
            <div className="col-span-6 lg:col-span-4 py-4 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Tournament Details
            </div>
            <div className="col-span-3 lg:col-span-2 py-4 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider hidden sm:block">
              Dates
            </div>
         
            <div className="col-span-3 lg:col-span-4 py-4 text-center text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Actions
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
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
          ) : tournaments.length > 0 ? (
            <div className="divide-y divide-zinc-700/30">
              {tournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  onClick={() => handleViewTournament(tournament._id)}
                  className="grid grid-cols-12 hover:bg-zinc-700/20 transition-all duration-200 cursor-pointer group px-4 sm:px-6"
                >
                  {/* Tournament Details */}
                  <div className="col-span-6 lg:col-span-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-700/50 rounded-lg group-hover:bg-zinc-600/50 transition-colors">
                        <Trophy size={20} className="text-gray-300" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-red-400 transition-colors">
                          {tournament.name}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                          {tournament.location || "Location not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="col-span-3 lg:col-span-2 py-4 hidden sm:block">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <Calendar size={14} />
                        Starts: {formatDateTime(tournament.start_date)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar size={12} />
                        Ends: {formatDateTime(tournament.end_date)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 lg:col-span-4 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={(e) => handleViewTournament(tournament._id)}
                        className="p-2 rounded-lg bg-zinc-700/50 hover:bg-blue-500/30 text-gray-400 hover:text-blue-300 transition-all duration-200 transform hover:scale-110 group/btn"
                        aria-label="View"
                        title="View Tournament"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={(e) =>
                          handleDeleteTournament(tournament._id, e)
                        }
                        disabled={deletingId === tournament._id}
                        className="p-2 rounded-lg bg-zinc-700/50 hover:bg-red-500/30 text-gray-400 hover:text-red-300 transition-all duration-200 transform hover:scale-110 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Delete"
                        title="Delete Tournament"
                      >
                        {deletingId === tournament._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>

                      <button
                        onClick={(e) =>
                          handleEditTournament(tournament._id, e)
                        }
                        disabled={deletingId === tournament._id}
                        className="p-2 rounded-lg bg-zinc-700/50 hover:bg-red-500/30 text-gray-400 hover:text-red-300 transition-all duration-200 transform hover:scale-110 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Delete"
                        title="Delete Tournament"
                      >
                        {deletingId === tournament._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                        ) : (
                          <PencilIcon size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="col-span-12 sm:hidden py-3 border-t border-zinc-700/30">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Start:</span>
                        <span className="text-gray-300">
                          {formatDate(tournament.start_date)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">End:</span>
                        <span className="text-gray-300">
                          {formatDate(tournament.end_date)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-gray-300">
                          {tournament.location || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <Trophy size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-gray-400 text-lg font-semibold mb-2">
                No tournaments found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Get started by creating your first tournament
              </p>
              <button
                onClick={handleCreateTournament}
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Create Tournament
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && tournaments.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <div>
              Showing{" "}
              <span className="text-white font-medium">
                {tournaments.length}
              </span>{" "}
              tournaments
            </div>
            <div className="flex items-center gap-4">
              <button className="hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="hover:text-white transition-colors">
                Next
              </button>
            </div>
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
